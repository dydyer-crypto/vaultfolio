"use client";

import { useCallback, useEffect, useState } from "react";

export interface PortfolioSnapshot {
  timestamp: number;
  netWorth: number;
  tokenCount: number;
  nftCount: number;
}

const STORAGE_KEY = "vaultfolio:history";
const MAX_POINTS = 96; // 24h avec snapshot toutes les 15 min
const INTERVAL_MS = 15 * 60 * 1000;

function loadHistory(): PortfolioSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as PortfolioSnapshot[];
    if (!Array.isArray(arr)) return [];
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    return arr.filter((s) => s.timestamp >= cutoff);
  } catch {
    return [];
  }
}

function saveHistory(history: PortfolioSnapshot[]) {
  if (typeof window === "undefined") return;
  const trimmed = history.slice(-MAX_POINTS);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function useHistory(netWorth: number, tokenCount: number, nftCount: number, enabled: boolean) {
  const [history, setHistory] = useState<PortfolioSnapshot[]>([]);
  const [pnl, setPnl] = useState<{ abs: number; pct: number } | null>(null);

  const snapshot = useCallback(() => {
    if (!enabled || netWorth <= 0) return;
    setHistory((prev) => {
      const now = Date.now();
      const last = prev[prev.length - 1];
      if (last && now - last.timestamp < INTERVAL_MS / 2) return prev;
      const next = [...prev, { timestamp: now, netWorth, tokenCount, nftCount }];
      saveHistory(next);
      return next.slice(-MAX_POINTS);
    });
  }, [netWorth, tokenCount, nftCount, enabled]);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    snapshot();
    if (!enabled) return;
    const interval = setInterval(() => snapshot(), INTERVAL_MS);
    return () => clearInterval(interval);
  }, [snapshot, enabled]);

  useEffect(() => {
    if (history.length < 2) {
      setPnl(null);
      return;
    }
    const first = history[0];
    const last = history[history.length - 1];
    const abs = last.netWorth - first.netWorth;
    const pct = first.netWorth > 0 ? (abs / first.netWorth) * 100 : 0;
    setPnl({ abs, pct });
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveHistory([]);
  }, []);

  return { history, pnl, clearHistory };
}