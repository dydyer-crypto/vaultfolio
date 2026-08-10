import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ─── Model + URL ─── */
const REALTIME_MODEL = "gpt-realtime";
const OPENAI_WS_URL = "wss://api.openai.com/v1/realtime";

/* ─── Guardrail constants ─── */
const MAX_SESSION_DURATION_SEC = 300;
const MAX_SESSIONS_PER_HOUR = 5;
const MAX_SESSIONS_PER_DAY = 20;
const MAX_CONCURRENT_SESSIONS = 20;
const MONTHLY_TOKEN_BUDGET_PER_IP = 500_000;
const GLOBAL_MONTHLY_BUDGET = 5_000_000;

/* ─── Redis keys ─── */
const K_HOURLY = "vaultfolio:voice:hourly:";
const K_DAILY = "vaultfolio:voice:daily:";
const K_CONCURRENT = "vaultfolio:voice:concurrent";
const K_MONTHLY_IP = "vaultfolio:voice:monthly_ip:";
const K_MONTHLY_GLOBAL = "vaultfolio:voice:monthly_global";

let redis: Redis | null = null;
function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

function getClientIP(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  return real ?? "unknown";
}

async function checkRateLimits(ip: string): Promise<{ ok: boolean; reason?: string }> {
  const r = getRedis();
  if (!r) return { ok: true };

  const now = Date.now();
  const hourKey = `${K_HOURLY}${ip}:${Math.floor(now / 3_600_000)}`;
  const dayKey = `${K_DAILY}${ip}:${Math.floor(now / 86_400_000)}`;

  try {
    const [hourCount, dayCount, concurrent, monthIp, monthGlobal] = await Promise.all([
      r.incr(hourKey),
      r.incr(dayKey),
      r.get<number>(K_CONCURRENT),
      r.get<number>(`${K_MONTHLY_IP}${ip}`),
      r.get<number>(K_MONTHLY_GLOBAL),
    ] as const);

    if (hourCount === 1) await r.expire(hourKey, 3600);
    if (dayCount === 1) await r.expire(dayKey, 86400);

    if ((hourCount ?? 0) > MAX_SESSIONS_PER_HOUR)
      return { ok: false, reason: `Rate limit: max ${MAX_SESSIONS_PER_HOUR} sessions/hour` };
    if ((dayCount ?? 0) > MAX_SESSIONS_PER_DAY)
      return { ok: false, reason: `Rate limit: max ${MAX_SESSIONS_PER_DAY} sessions/day` };
    if ((concurrent ?? 0) >= MAX_CONCURRENT_SESSIONS)
      return { ok: false, reason: `Server busy — try again shortly` };
    if ((monthIp ?? 0) >= MONTHLY_TOKEN_BUDGET_PER_IP)
      return { ok: false, reason: `Monthly budget exceeded for your IP` };
    if ((monthGlobal ?? 0) >= GLOBAL_MONTHLY_BUDGET)
      return { ok: false, reason: `Global monthly budget reached` };

    return { ok: true };
  } catch {
    return { ok: true };
  }
}

const SYSTEM_PROMPT = `You are the voice assistant for Vaultfolio, a multi-chain Web3 portfolio dashboard SaaS.

## Your role
You are a sales assistant on the Vaultfolio website. Inform prospects, answer questions, and guide them toward connecting their wallet or visiting the pricing page.

## About Vaultfolio
- Read-only Web3 portfolio dashboard: balances, ERC-20 tokens, NFTs, DeFi positions across 19 chains
- Live prices via CoinGecko, 24h change, read-only (no seed phrase, no signature, no fund access)
- Freemium: Free ($0, 2 chains, 1 wallet), Pro ($9/mo or $79/yr, 6 chains, 3 wallets, DeFi, alerts, export), Whale ($29/mo or $279/yr, 20+ chains, 20 wallets, analytics, white-label)
- Works with MetaMask, Coinbase, WalletConnect, Rainbow, Rabby
- Setup in under 60 seconds

## Guidelines
- Keep responses short (2-4 sentences per turn)
- Match the user's language (English, French, or Arabic)
- Emphasize security: read-only, no signatures, funds can never be moved
- If ready to try, tell them to click "Connect Wallet" or visit /pricing
- Be friendly, professional, concise — like an Apple Store specialist`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice assistant not configured" }, { status: 503 });
  }

  const ip = getClientIP(req);

  // ── Guardrail 1: rate limits ──
  const limitCheck = await checkRateLimits(ip);
  if (!limitCheck.ok) {
    return NextResponse.json({ error: limitCheck.reason ?? "Rate limited" }, { status: 429 });
  }

  // ── Open WebSocket to OpenAI directly (no ephemeral token endpoint) ──
  try {
    const { WebSocket } = await import("ws");

    const wsUrl = `${OPENAI_WS_URL}?model=${REALTIME_MODEL}`;
    const upstream = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    const sessionId = `rt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Wait for connection with timeout
    const connected = await new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), 8000);
      upstream.on("open", () => {
        clearTimeout(timeout);
        resolve(true);
      });
      upstream.on("error", () => {
        clearTimeout(timeout);
        resolve(false);
      });
    });

    if (!connected) {
      return NextResponse.json({ error: "Failed to connect to voice service" }, { status: 502 });
    }

    // Send session config
    upstream.send(
      JSON.stringify({
        type: "session.update",
        session: {
          instructions: SYSTEM_PROMPT,
          voice: "alloy",
          input_audio_format: "pcm16",
          output_audio_format: "pcm16",
          input_audio_transcription: { model: "whisper-1" },
          turn_detection: {
            type: "server_vad",
            threshold: 0.5,
            prefix_padding_ms: 300,
            silence_duration_ms: 500,
          },
          temperature: 0.7,
          max_response_output_tokens: 500,
        },
      })
    );

    // Keep connection alive briefly to confirm session is ready
    await new Promise((r) => setTimeout(r, 500));

    // ── Guardrail 2: increment counters ──
    const r = getRedis();
    if (r) {
      try {
        await Promise.all([
          r.incr(K_CONCURRENT),
          r.incrby(`${K_MONTHLY_IP}${ip}`, 8000),
          r.incrby(K_MONTHLY_GLOBAL, 8000),
        ] as const);
      } catch {
        // ignore
      }
    }

    // Close the upstream — client will connect directly via WebSocket relay
    upstream.close();

    return NextResponse.json({
      sessionId,
      status: "ready",
      maxDurationSec: MAX_SESSION_DURATION_SEC,
      model: REALTIME_MODEL,
      // Client connects to our WebSocket relay endpoint
      wsUrl: `/api/voice-proxy/ws?session=${sessionId}&ip=${encodeURIComponent(ip)}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Voice proxy error:", msg);
    return NextResponse.json({ error: "Voice session error" }, { status: 500 });
  }
}

/* ── Cleanup: decrement concurrent counter ── */
export async function DELETE(req: Request) {
  const r = getRedis();
  if (!r) return NextResponse.json({ ok: true });

  try {
    const current = (await r.get<number>(K_CONCURRENT)) ?? 0;
    if (current > 0) await r.decr(K_CONCURRENT);
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}