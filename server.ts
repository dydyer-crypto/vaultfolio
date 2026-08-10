import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer, WebSocket } from "ws";

const dev = false;
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

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

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  // ─── WebSocket server for voice relay ───
  const wss = new WebSocketServer({ noServer: true });

  server.on("upgrade", (req, socket, head) => {
    const { pathname } = parse(req.url!, true);
    if (pathname === "/api/voice-ws") {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit("connection", ws, req);
      });
    } else {
      // Let Next.js handle HMR websockets in dev
      socket.destroy();
    }
  });

  wss.on("connection", async (ws: WebSocket) => {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      ws.send(JSON.stringify({ type: "error", error: { message: "Voice not configured" } }));
      ws.close();
      return;
    }

    // ── Connect to OpenAI Realtime (GA API — no beta header) ──
    const wsUrl = `${OPENAI_WS_URL}?model=${REALTIME_MODEL}`;
    const upstream = new WebSocket(wsUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    let upstreamReady = false;

    upstream.on("open", () => {
      console.log("[voice] OpenAI connected (GA API)");
      upstream.send(JSON.stringify({
        type: "session.update",
        session: {
          type: "realtime",
          instructions: SYSTEM_PROMPT,
          audio: {
            input: {
              format: { type: "audio/pcm", rate: 24000 },
              transcription: { model: "whisper-1" },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 500,
              },
            },
            output: {
              format: { type: "audio/pcm", rate: 24000 },
              voice: "alloy",
            },
          },
          max_output_tokens: 500,
        },
      }));
      upstreamReady = true;
      ws.send(JSON.stringify({ type: "session.ready" }));
    });

    // ── OpenAI → browser: forward all messages ──
    upstream.on("message", (data: Buffer) => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(data.toString());
      }
    });

    upstream.on("error", (err) => {
      console.error("[voice] OpenAI error:", err.message);
      ws.send(JSON.stringify({ type: "error", error: { message: "Voice service error" } }));
      ws.close();
    });

    upstream.on("close", () => {
      console.log("[voice] OpenAI closed");
      if (ws.readyState === WebSocket.OPEN) ws.close();
    });

    // ── Browser → OpenAI: forward audio + control messages ──
    ws.on("message", (data: Buffer) => {
      if (!upstreamReady || upstream.readyState !== WebSocket.OPEN) return;
      // Forward as-is (JSON messages with audio buffer append, commit, response.create)
      upstream.send(data.toString());
    });

    ws.on("close", () => {
      console.log("[voice] Browser closed, cleaning up");
      if (upstream.readyState === WebSocket.OPEN) upstream.close();
    });

    ws.on("error", () => {
      if (upstream.readyState === WebSocket.OPEN) upstream.close();
    });
  });

  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});