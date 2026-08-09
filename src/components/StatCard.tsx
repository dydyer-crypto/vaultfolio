"use client";

import { cn, formatCurrency } from "@/lib/format";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  loading?: boolean;
}

export function StatCard({ label, value, sub, accent, loading }: StatCardProps) {
  return (
    <div
      className={cn(
        "card-pressable lift-on-hover rounded-2xl border p-4 sm:p-5",
        accent
          ? "material-light border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-slate-900/40 shadow-lg shadow-brand-500/10"
          : "border-white/5 bg-slate-900/40"
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
      {loading ? (
        <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-700/60" />
      ) : (
        <p className="mt-1 text-2xl font-bold tracking-tight text-white">{value}</p>
      )}
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </div>
  );
}

export function StatGrid({
  netWorth,
  tokenCount,
  nftCount,
  chainCount,
  loading,
  t,
}: {
  netWorth: number;
  tokenCount: number;
  nftCount: number;
  chainCount: number;
  loading: boolean;
  t: (k: "netWorth" | "tokens" | "collectibles" | "networks") => string;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <StatCard label={t("netWorth")} value={formatCurrency(netWorth)} accent loading={loading} />
      <StatCard
        label={t("tokens")}
        value={loading ? "—" : String(tokenCount)}
        loading={loading}
      />
      <StatCard
        label={t("collectibles")}
        value={loading ? "—" : String(nftCount)}
        loading={loading}
      />
      <StatCard
        label={t("networks")}
        value={loading ? "—" : String(chainCount)}
        loading={loading}
      />
    </div>
  );
}