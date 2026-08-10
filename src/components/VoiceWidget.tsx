"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const MAX_DURATION_SEC = 900; // 15 minutes — enough for a real conversation

type Status = "idle" | "connecting" | "connected" | "listening" | "speaking" | "error";

export function VoiceWidget() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const playQueueRef = useRef<ArrayBuffer[]>([]);
  const isPlayingRef = useRef(false);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const intentionalCloseRef = useRef(false);

  const cleanup = useCallback(() => {
    intentionalCloseRef.current = true;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close();
      audioCtxRef.current = null;
    }
    playQueueRef.current = [];
    isPlayingRef.current = false;
  }, []);

  const playAudioQueue = useCallback(async () => {
    if (isPlayingRef.current || playQueueRef.current.length === 0) return;
    isPlayingRef.current = true;
    const ctx = audioCtxRef.current;
    if (!ctx) {
      isPlayingRef.current = false;
      return;
    }
    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch {}
    }
    const chunk = playQueueRef.current.shift();
    if (chunk) {
      try {
        const audioBuffer = pcm16ToAudioBuffer(ctx, chunk);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        const gain = ctx.createGain();
        gain.gain.value = 1.0;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.onended = () => {
          isPlayingRef.current = false;
          if (playQueueRef.current.length > 0) void playAudioQueue();
          else if (wsRef.current?.readyState === WebSocket.OPEN) setStatus("listening");
        };
        source.start();
        setStatus("speaking");
        console.log("[voice] Playing", audioBuffer.length, "samples @", audioBuffer.sampleRate, "Hz, ctx state:", ctx.state);
      } catch (e) {
        console.error("[voice] Playback error:", e);
        isPlayingRef.current = false;
      }
    } else {
      isPlayingRef.current = false;
    }
  }, []);

  const startSession = useCallback(async () => {
      intentionalCloseRef.current = false;
      setStatus("connecting");
      setErrorMsg("");

    try {
      // ── Audio context + mic ──
      audioCtxRef.current = new AudioContext();
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // ── Connect to our WebSocket relay ──
      const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${wsProtocol}//${window.location.host}/api/voice-ws`;
      console.log("[voice] Connecting to:", wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        startTimeRef.current = Date.now();
        setElapsed(0);

        // ── Start sending mic audio immediately ──
        const ctx = audioCtxRef.current!;
        const micStream = micStreamRef.current!;
        const source = ctx.createMediaStreamSource(micStream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = floatToPcm16Resample(inputData, ctx.sampleRate || 48000, 24000);
          const base64 = arrayBufferToBase64(pcm16.buffer);
          ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: base64 }));
        };

        source.connect(processor);
        // ScriptProcessorNode needs a connection to destination to fire onaudioprocess —
        // connect through a muted gain node to keep silence and avoid feedback
        const muteGain = ctx.createGain();
        muteGain.gain.value = 0;
        processor.connect(muteGain);
        muteGain.connect(ctx.destination);

        setStatus("listening");
      };

      ws.onmessage = (event) => {
        let msg: Record<string, unknown>;
        try {
          msg = JSON.parse(event.data as string);
        } catch {
          return;
        }
        const type = msg.type as string;

        if (type === "session.ready") {
          // OpenAI session prête → l'agent se présente en premier
          ws.send(JSON.stringify({
            type: "response.create",
            response: {
              instructions: "Introduce yourself as the Vaultfolio voice assistant in ENGLISH. Say: 'Hello! I'm the Vaultfolio voice assistant. I can introduce you to our multi-chain Web3 portfolio dashboard. I speak many languages — French, Arabic, Spanish, and more — so feel free to talk to me in any of them. Ask me anything!",
            },
          }));
          setStatus("speaking");
          return;
        }

        if (type === "response.output_audio.delta" || type === "response.audio.delta") {
          const audioBase64 = msg.delta as string;
          if (audioBase64) {
            const bytes = base64ToArrayBuffer(audioBase64);
            playQueueRef.current.push(bytes);
            console.log("[voice] Audio chunk received:", bytes.byteLength, "bytes, queue:", playQueueRef.current.length);
            if (!isPlayingRef.current) void playAudioQueue();
          }
        } else if (type === "response.output_audio.done" || type === "response.audio.done" || type === "response.done") {
          if (playQueueRef.current.length === 0) setStatus("listening");
        } else if (type === "error") {
          const errContent = msg.error as { message?: string } | undefined;
          setStatus("error");
          setErrorMsg(errContent?.message ?? "Voice error");
        }
      };

      ws.onerror = () => {
        setStatus("error");
        const msg = isFr
          ? "Erreur de connexion. L'agent vocal nécessite : npm run start (pas npm run dev). F12 Console pour plus de détails."
          : "Connection error. Voice agent requires npm run start (not npm run dev). Check Console for details.";
        setErrorMsg(msg);
      };

      ws.onclose = (event) => {
        if (intentionalCloseRef.current) {
          // Fermeture volontaire (bouton stop) — pas d'erreur
          setStatus("idle");
          return;
        }
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        console.error(`[voice] WS CLOSED at ${sec}s: code=${event.code}, reason="${event.reason}", wasClean=${event.wasClean}`);
        setStatus((prev) => {
          if (prev === "error") return prev;
          const msg = isFr
            ? `Connexion perdue à ${sec}s. Code: ${event.code}. Relance npm run start et réessaie.`
            : `Connection lost at ${sec}s. Code: ${event.code}. Run npm run start and retry.`;
          setErrorMsg(msg);
          return "error";
        });
      };

      // ── Client-side timer guardrail ──
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(sec);
        if (sec >= MAX_DURATION_SEC) {
          void stopSession();
        }
      }, 1000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to start");
    }
  }, [playAudioQueue]);

  const stopSession = useCallback(() => {
    cleanup();
    setStatus("idle");
    setElapsed(0);
  }, [cleanup]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  useEffect(() => {
    if (status === "idle") {
      const t = setTimeout(() => setShowHint(true), 3000);
      return () => clearTimeout(t);
    }
    setShowHint(false);
  }, [status]);

  const isConnected = status === "connected" || status === "listening" || status === "speaking";
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const timeLeft = Math.max(0, MAX_DURATION_SEC - elapsed);
  const lang = typeof navigator !== "undefined" ? navigator.language : "en";
  const isFr = lang.startsWith("fr");
  const isAr = lang.startsWith("ar");

  return (
    <div className="fixed bottom-4 right-4 z-[var(--z-overlay)] flex flex-col items-end gap-2">
      {showHint && status === "idle" && (
        <div className="animate-spring-up material-light max-w-[240px] rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 shadow-lg">
          <p className="font-medium text-white">{isFr ? "Une question ?" : isAr ? "لديك سؤال؟" : "Have a question?"}</p>
          <p className="mt-0.5 text-xs text-slate-400">{isFr ? "Parlez à notre assistant vocal" : isAr ? "تحدّث إلى مساعدنا الصوتي" : "Talk to our voice assistant"}</p>
          <button
            className="pressable absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:text-white"
            onClick={() => setShowHint(false)}
            aria-label="Dismiss hint"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {status === "error" && errorMsg && (
        <div className="animate-spring-up max-w-[260px] rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs text-rose-300">
          {errorMsg}
          <button onClick={() => { setStatus("idle"); setErrorMsg(""); }} className="pressable ml-2 underline">
            {isFr ? "Fermer" : isAr ? "إغلاق" : "Dismiss"}
          </button>
        </div>
      )}

      {isConnected && (
        <div className="material-light flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <span className={`pulse-dot flex h-2 w-2 rounded-full ${
            status === "speaking" ? "bg-brand-400" : status === "listening" ? "bg-emerald-400" : "bg-amber-400"
          }`} />
          <span className="font-mono-data text-slate-200">{timeDisplay}</span>
          <span className="text-slate-500">/ 5:00</span>
        </div>
      )}

      <button
        onClick={isConnected ? stopSession : startSession}
        disabled={status === "connecting"}
        aria-label={isConnected ? "End voice session" : "Start voice session"}
        className={`pressable accent-glow flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition ${
          status === "connecting"
            ? "bg-slate-700"
            : isConnected
              ? "bg-rose-500 hover:bg-rose-600"
              : "bg-gradient-to-br from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500"
        }`}
      >
        {status === "connecting" ? (
          <svg className="animate-spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 12a9 9 0 11-6.219-8.56" />
          </svg>
        ) : isConnected ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <rect x="6" y="6" width="12" height="12" rx="2" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M12 1a3 3 0 013 3v8a3 3 0 01-6 0V4a3 3 0 013-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
          </svg>
        )}
      </button>

      {isConnected && timeLeft <= 30 && timeLeft > 0 && (
        <div className="material-light animate-spring-in rounded-lg px-3 py-1.5 text-xs text-amber-300">
          {isFr ? `Fin dans ${timeLeft}s` : isAr ? `ينتهي خلال ${timeLeft}ث` : `Ending in ${timeLeft}s`}
        </div>
      )}
    </div>
  );
}

function floatToPcm16Resample(float32Array: Float32Array, inputRate: number, outputRate: number): Int16Array {
  const ratio = outputRate / inputRate;
  const newLength = Math.floor(float32Array.length * ratio);
  const result = new Int16Array(newLength);
  for (let i = 0; i < newLength; i++) {
    const origIndex = Math.floor(i / ratio);
    const sample = Math.max(-1, Math.min(1, float32Array[origIndex]));
    result[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
  }
  return result;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function pcm16ToAudioBuffer(ctx: AudioContext, chunk: ArrayBuffer): AudioBuffer {
  const view = new DataView(chunk);
  const sampleCount = Math.floor(chunk.byteLength / 2);
  // PCM source is 24000 Hz — the browser resamples automatically at playback.
  // Using ctx.sampleRate here would play at 2x speed on a 48000 Hz context.
  const audioBuffer = ctx.createBuffer(1, sampleCount, 24000);
  const channelData = audioBuffer.getChannelData(0);

  for (let i = 0; i < sampleCount; i++) {
    const sample = view.getInt16(i * 2, true);
    channelData[i] = sample / 32768;
  }

  return audioBuffer;
}