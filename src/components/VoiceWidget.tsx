"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const MAX_DURATION_SEC = 300;
const RECONNECT_TIMEOUT_MS = 15_000;

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

  const cleanup = useCallback(() => {
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
    const chunk = playQueueRef.current.shift();
    if (chunk) {
      try {
        const audioBuffer = await ctx.decodeAudioData(chunk);
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);
        source.onended = () => {
          isPlayingRef.current = false;
          if (playQueueRef.current.length > 0) void playAudioQueue();
          else if (wsRef.current?.readyState === WebSocket.OPEN) setStatus("listening");
        };
        source.start();
        setStatus("speaking");
      } catch {
        isPlayingRef.current = false;
      }
    } else {
      isPlayingRef.current = false;
    }
  }, []);

  const startSession = useCallback(async () => {
    setStatus("connecting");
    setErrorMsg("");

    try {
      const res = await fetch("/api/voice-proxy", { method: "POST" });
      const data = (await res.json()) as {
        clientSecret?: string;
        wsUrl?: string;
        error?: string;
        maxDurationSec?: number;
      };

      if (!res.ok || !data.clientSecret || !data.wsUrl) {
        const msg = data.error ?? "Connection failed";
        setStatus("error");
        setErrorMsg(msg);
        return;
      }

      // ── Audio context ──
      audioCtxRef.current = new AudioContext({ sampleRate: 24000 });
      micStreamRef.current = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 24000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // ── WebSocket to OpenAI Realtime (with ephemeral token) ──
      const ws = new WebSocket(
        `${data.wsUrl}&authorization_bearer=${encodeURIComponent(data.clientSecret)}`,
        ["realtime", "openai-insecure-api-key." + data.clientSecret]
      );

      wsRef.current = ws;

      ws.onopen = () => {
        setStatus("connected");
        startTimeRef.current = Date.now();
        setElapsed(0);

        // ── Start sending mic audio ──
        const ctx = audioCtxRef.current!;
        const micStream = micStreamRef.current!;
        const source = ctx.createMediaStreamSource(micStream);
        const processor = ctx.createScriptProcessor(4096, 1, 1);
        processorRef.current = processor;

        processor.onaudioprocess = (e) => {
          if (ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const pcm16 = floatToPcm16(inputData);
          const base64 = arrayBufferToBase64(pcm16.buffer);
          ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: base64 }));
        };

        source.connect(processor);
        processor.connect(ctx.destination);

        // ── Commit audio buffer + signal ready ──
        ws.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
        ws.send(JSON.stringify({ type: "response.create" }));

        setStatus("listening");
      };

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data) as Record<string, unknown>;
        const type = msg.type as string;

        if (type === "response.audio.delta") {
          const audioBase64 = msg.delta as string;
          if (audioBase64) {
            const bytes = base64ToArrayBuffer(audioBase64);
            playQueueRef.current.push(bytes);
            if (!isPlayingRef.current) void playAudioQueue();
          }
        } else if (type === "response.audio.done" || type === "response.done") {
          // response finished — back to listening
          if (playQueueRef.current.length === 0) setStatus("listening");
        } else if (type === "error") {
          const errContent = msg.error as { message?: string } | undefined;
          setStatus("error");
          setErrorMsg(errContent?.message ?? "Voice error");
        }
      };

      ws.onerror = () => {
        setStatus("error");
        setErrorMsg("Connection error");
      };

      ws.onclose = () => {
        if (status !== "error") setStatus("idle");
      };

      // ── Guardrail: client-side timer ──
      const maxSec = data.maxDurationSec ?? MAX_DURATION_SEC;
      timerRef.current = setInterval(() => {
        const sec = Math.floor((Date.now() - startTimeRef.current) / 1000);
        setElapsed(sec);
        if (sec >= maxSec) {
          void stopSession();
        }
      }, 1000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to start");
    }
  }, [status, playAudioQueue]);

  const stopSession = useCallback(async () => {
    cleanup();
    setStatus("idle");
    setElapsed(0);
    // notify proxy to decrement concurrent counter
    try {
      await fetch("/api/voice-proxy", { method: "DELETE" });
    } catch {
      // ignore
    }
  }, [cleanup]);

  // ── Cleanup on unmount ──
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  // ── Show hint after 3 seconds idle ──
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {/* Hint bubble */}
      {showHint && status === "idle" && (
        <div className="animate-spring-up material-light max-w-[240px] rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200 shadow-lg">
          <p className="font-medium text-white">
            {navigator.language.startsWith("fr") ? "Une question ?" : "Have a question?"}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            {navigator.language.startsWith("fr") ? "Parlez a notre assistant vocal" : "Talk to our voice assistant"}
          </p>
          <button
            className="pressable absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-slate-400 transition hover:text-white"
            onClick={() => setShowHint(false)}
            aria-label="Dismiss"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error message */}
      {status === "error" && errorMsg && (
        <div className="animate-spring-up max-w-[260px] rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs text-rose-300">
          {errorMsg}
          <button
            onClick={() => { setStatus("idle"); setErrorMsg(""); }}
            className="pressable ml-2 underline"
          >
            {navigator.language.startsWith("fr") ? "Fermer" : "Dismiss"}
          </button>
        </div>
      )}

      {/* Timer */}
      {isConnected && (
        <div className="material-light flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
          <span className={`pulse-dot flex h-2 w-2 rounded-full ${
            status === "speaking" ? "bg-brand-400" : status === "listening" ? "bg-emerald-400" : "bg-amber-400"
          }`} />
          <span className="font-mono-data text-slate-200">{timeDisplay}</span>
          <span className="text-slate-500">/ 5:00</span>
        </div>
      )}

      {/* Main button */}
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

      {/* Auto-stop warning */}
      {isConnected && timeLeft <= 30 && timeLeft > 0 && (
        <div className="material-light animate-spring-in rounded-lg px-3 py-1.5 text-xs text-amber-300">
          {navigator.language.startsWith("fr") ? `Fin dans ${timeLeft}s` : `Ending in ${timeLeft}s`}
        </div>
      )}
    </div>
  );
}

// ─── Audio helpers ───

function floatToPcm16(float32Array: Float32Array): Int16Array {
  const pcm16 = new Int16Array(float32Array.length);
  for (let i = 0; i < float32Array.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Array[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
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