import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

export const runtime = "nodejs";

const OPENAI_SESSIONS_URL = "https://api.openai.com/v1/realtime/sessions";
const REALTIME_MODEL = "gpt-4o-realtime-preview-2024-12-17";

/* ─── Guardrail constants ─── */
const MAX_SESSION_DURATION_SEC = 300;          // 5 min per call
const MAX_SESSIONS_PER_HOUR = 5;               // per IP
const MAX_SESSIONS_PER_DAY = 20;              // per IP
const MAX_CONCURRENT_SESSIONS = 20;           // global
const MONTHLY_TOKEN_BUDGET_PER_IP = 500_000;   // ~$5 of realtime audio
const GLOBAL_MONTHLY_BUDGET = 5_000_000;       // ~$50

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
  if (!r) return { ok: true }; // degrade gracefully without Redis

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

    if ((hourCount ?? 0) > MAX_SESSIONS_PER_HOUR) {
      return { ok: false, reason: `Rate limit: max ${MAX_SESSIONS_PER_HOUR} sessions/hour per IP` };
    }
    if ((dayCount ?? 0) > MAX_SESSIONS_PER_DAY) {
      return { ok: false, reason: `Rate limit: max ${MAX_SESSIONS_PER_DAY} sessions/day per IP` };
    }
    if ((concurrent ?? 0) >= MAX_CONCURRENT_SESSIONS) {
      return { ok: false, reason: `Server busy: max ${MAX_CONCURRENT_SESSIONS} concurrent sessions. Try again shortly.` };
    }
    if ((monthIp ?? 0) >= MONTHLY_TOKEN_BUDGET_PER_IP) {
      return { ok: false, reason: `Monthly token budget exceeded for your IP. Contact support.` };
    }
    if ((monthGlobal ?? 0) >= GLOBAL_MONTHLY_BUDGET) {
      return { ok: false, reason: `Global monthly budget reached. Voice assistant paused until next cycle.` };
    }

    return { ok: true };
  } catch {
    return { ok: true }; // degrade gracefully
  }
}

const SYSTEM_PROMPT = `You are the voice assistant for Vaultfolio, a multi-chain Web3 portfolio dashboard SaaS.

## Your role
You are a sales assistant on the Vaultfolio website. Your goal is to inform prospects, answer questions, and guide them toward connecting their wallet or visiting the pricing page.

## About Vaultfolio
- A read-only Web3 portfolio dashboard that aggregates balances, ERC-20 tokens, NFTs, and DeFi positions across 19 chains (Ethereum, Polygon, Base, Arbitrum, Optimism, Avalanche, BNB Chain, and 12 more)
- Live prices via CoinGecko with 24h change
- Read-only: no seed phrase, no signature, no spending approval, no fund access — 100% safe
- Freemium model: Free ($0, 2 chains, 1 wallet), Pro ($9/mo or $79/yr, 6 chains, 3 wallets, DeFi, alerts, export, PnL history), Whale ($29/mo or $279/yr, 20+ chains, 20 wallets, analytics, white-label)
- Works with MetaMask, Coinbase, WalletConnect, Rainbow, Rabby
- Setup in under 60 seconds

## Key selling points
1. Security: read-only, no signatures, no seed phrase — funds can never be moved
2. Multi-chain: 19 chains in one dashboard instead of juggling 3+ explorers
3. Speed: see your full portfolio in under 60 seconds
4. Price: starts free, Pro is $9/mo (cheaper than DeBank/Zapper Pro)

## Conversation guidelines
- Keep responses short and conversational (2-4 sentences max per turn)
- Match the user's language (English, French, or Arabic)
- If they ask about security, emphasize read-only and no signatures
- If they ask about pricing, mention Free/Pro/Whale and suggest visiting the pricing page
- If they ask about chains, list the main ones (Ethereum, Polygon, Base, Arbitrum, Optimism, Avalanche)
- If they're ready to try, tell them to click "Connect Wallet" or visit /pricing
- Be friendly, professional, and confident — not pushy
- If they ask something you don't know, say you'll connect them with the team

## Tone
Warm, knowledgeable, concise. Like a helpful product specialist at an Apple Store.`;

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Voice assistant not configured (missing OPENAI_API_KEY)" }, { status: 503 });
  }

  const ip = getClientIP(req);

  // ── Guardrail 1: rate limits + budget ──
  const limitCheck = await checkRateLimits(ip);
  if (!limitCheck.ok) {
    return NextResponse.json({ error: limitCheck.reason ?? "Rate limited" }, { status: 429 });
  }

  // ── Create ephemeral Realtime session ──
  try {
    const res = await fetch(OPENAI_SESSIONS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "realtime=v1",
      },
      body: JSON.stringify({
        model: REALTIME_MODEL,
        voice: "alloy",
        instructions: SYSTEM_PROMPT,
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
        max_response_output_tokens: 500, // cap output per turn
        // ephemeral token expires; OpenAI default ~10 min
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("OpenAI session creation failed:", res.status, errText);
      return NextResponse.json({ error: "Failed to create voice session" }, { status: 502 });
    }

    const data = (await res.json()) as {
      id: string;
      client_secret: { value: string; expires_at: number };
      expires_at: number;
    };

    // ── Guardrail 2: increment counters ──
    const r = getRedis();
    if (r) {
      try {
        await Promise.all([
          r.incr(K_CONCURRENT),
          r.incrby(`${K_MONTHLY_IP}${ip}`, 8000),   // estimate ~8k tokens per session (audio+text)
          r.incrby(K_MONTHLY_GLOBAL, 8000),
        ] as const);
      } catch {
        // ignore Redis errors
      }
    }

    return NextResponse.json({
      sessionId: data.id,
      clientSecret: data.client_secret.value,
      expiresAt: data.expires_at,
      maxDurationSec: MAX_SESSION_DURATION_SEC,
      wsUrl: `wss://api.openai.com/v1/realtime?model=${REALTIME_MODEL}`,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    console.error("Voice proxy error:", msg);
    return NextResponse.json({ error: "Voice session error" }, { status: 500 });
  }
}

/* ── Cleanup endpoint: called by client when session ends ── */
export async function DELETE(req: Request) {
  const r = getRedis();
  if (!r) return NextResponse.json({ ok: true });

  const ip = getClientIP(req);
  try {
    const current = (await r.get<number>(K_CONCURRENT)) ?? 0;
    if (current > 0) await r.decr(K_CONCURRENT);
  } catch {
    // ignore
  }
  return NextResponse.json({ ok: true });
}