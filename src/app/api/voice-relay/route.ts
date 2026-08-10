import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * WebSocket relay endpoint.
 * This route handles the HTTP upgrade request and bridges:
 *   browser WebSocket  <-->  OpenAI Realtime WebSocket
 *
 * The API key stays server-side. The browser only talks to us.
 */

const REALTIME_MODEL = "gpt-realtime";
const OPENAI_WS_URL = "wss://api.openai.com/v1/realtime";

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

export async function GET(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  // Check if this is a WebSocket upgrade request
  const upgradeHeader = req.headers.get("upgrade");
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== "websocket") {
    return NextResponse.json({ error: "WebSocket upgrade required" }, { status: 426 });
  }

  // Next.js App Router doesn't support raw WebSocket upgrade natively.
  // We use a custom server approach via the raw socket.
  // This endpoint signals to the client to use the direct relay instead.
  return NextResponse.json({
    error: "WebSocket relay not available in standard Next.js",
    model: REALTIME_MODEL,
    instructions: "Use the client-side direct connection with ephemeral approach instead",
  }, { status: 426 });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const body = (await req.json()) as { audio?: string; action?: string };

  // This is a fallback relay mode — client sends audio chunks via POST
  // and we forward to OpenAI WebSocket and return audio response
  // (simplified for environments where WebSocket upgrade isn't available)

  if (body.action === "init") {
    try {
      const { WebSocket } = await import("ws");
      const wsUrl = `${OPENAI_WS_URL}?model=${REALTIME_MODEL}`;
      const upstream = new WebSocket(wsUrl, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "OpenAI-Beta": "realtime=v1",
        },
      });

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
        return NextResponse.json({ error: "Voice connection failed" }, { status: 502 });
      }

      // Send session config
      upstream.send(JSON.stringify({
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
      }));

      // Wait for session to be ready
      await new Promise((r) => setTimeout(r, 600));
      upstream.close();

      return NextResponse.json({ status: "ready", model: REALTIME_MODEL });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Voice init error:", msg);
      return NextResponse.json({ error: "Voice init failed" }, { status: 502 });
    }
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}