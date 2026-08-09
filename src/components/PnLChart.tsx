"use client";

import { useMemo } from "react";
import type { PortfolioSnapshot } from "@/lib/useHistory";
import { formatCurrency } from "@/lib/format";

interface PnLChartProps {
  history: PortfolioSnapshot[];
  pnl: { abs: number; pct: number } | null;
}

export function PnLChart({ history, pnl }: PnLChartProps) {
  const points = useMemo(() => {
    if (history.length < 2) return [];
    const values = history.map((h) => h.netWorth);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const W = 280;
    const H = 80;
    const pad = 4;
    return history.map((h, i) => {
      const x = pad + (i / (history.length - 1)) * (W - 2 * pad);
      const y = H - pad - ((h.netWorth - min) / range) * (H - 2 * pad);
      return { x, y, ...h };
    });
  }, [history]);

  const path = useMemo(() => {
    if (points.length === 0) return "";
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const W = 280;
    const H = 80;
    const last = points[points.length - 1];
    return `M${points[0].x.toFixed(1)},${(H - 4).toFixed(1)} ` +
      points.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
      ` L${last.x.toFixed(1)},${(H - 4).toFixed(1)} Z`;
  }, [points]);

  if (points.length < 2) {
    return (
      <div className="flex h-32 items-center justify-center rounded-xl border border-white/5 bg-slate-900/40 text-xs text-slate-500">
        Collecting data… (need 15+ min for first chart)
      </div>
    );
  }

  const isUp = pnl ? pnl.abs >= 0 : true;
  const strokeColor = isUp ? "#34d399" : "#f43f5e";
  const fillColor = isUp ? "rgba(52,211,153,0.1)" : "rgba(244,63,94,0.1)";

  return (
    <div className="card-pressable rounded-xl border border-white/5 bg-slate-900/40 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">24h PnL</p>
          <p className="mt-1 text-lg font-bold text-white">
            {pnl && (
              <span className={isUp ? "text-emerald-400" : "text-rose-400"}>
                {isUp ? "+" : ""}{formatCurrency(pnl.abs)} ({isUp ? "+" : ""}{pnl.pct.toFixed(2)}%)
              </span>
            )}
          </p>
        </div>
        <span className="text-xs text-slate-500">{history.length} pts</span>
      </div>
      <svg viewBox="0 0 280 80" className="w-full" preserveAspectRatio="none" style={{ height: 80 }}>
        <path d={areaPath} fill={fillColor} className="chart-area-animated" />
        <path d={path} fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinejoin="round" className="chart-line-animated" />
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill={strokeColor}
            className="animate-spring-in"
          >
            <animate attributeName="r" values="2.5;4;2.5" dur="2s" repeatCount="indefinite" />
          </circle>
        )}
      </svg>
    </div>
  );
}