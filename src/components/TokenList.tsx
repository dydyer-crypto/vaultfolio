"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { chainMeta, type ChainId } from "@/lib/chains";
import { formatAmount, formatCurrency, shortName } from "@/lib/format";
import type { TokenBalance } from "@/lib/prices";

interface TokenListProps {
  tokens: TokenBalance[];
  loading: boolean;
  address: string;
}

export function TokenList({ tokens, loading, address }: TokenListProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-3">
            <div className="h-9 w-9 animate-pulse rounded-full bg-slate-700/60" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-700/60" />
              <div className="h-2.5 w-16 animate-pulse rounded bg-slate-700/40" />
            </div>
            <div className="h-3 w-20 animate-pulse rounded bg-slate-700/60" />
          </div>
        ))}
        <p className="py-2 text-center text-xs text-slate-500">{t("loadingTokens")}</p>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/30 p-8 text-center">
        <p className="text-sm text-slate-400">{t("noTokens")}</p>
      </div>
    );
  }

  return (
    <div className="animate-stagger space-y-1.5">
      <div className="grid grid-cols-[1fr_auto_auto] items-center gap-2 px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:gap-4">
        <span>{t("token")}</span>
        <span className="text-right">{t("balance")}</span>
        <span className="text-right">{t("value")}</span>
      </div>
      {tokens.map((tok, i) => {
        const meta = chainMeta[tok.chainId as ChainId];
        return (
          <div
            key={`${tok.chainId}-${tok.tokenAddress ?? "native"}-${i}`}
            className="card-pressable lift-on-hover flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-3 transition hover:border-white/10 hover:bg-slate-900/70"
          >
            <div className="relative flex-shrink-0">
              {tok.logo ? (
                <Image
                  src={tok.logo}
                  alt={tok.symbol}
                  width={36}
                  height={36}
                  className="h-9 w-9 rounded-full"
                  unoptimized
                />
              ) : (
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: meta?.color ?? "#3366ff" }}
                >
                  {tok.symbol.slice(0, 2)}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium text-white">{shortName(tok.name)}</p>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                  style={{
                    color: meta?.color ?? "#94a3b8",
                    backgroundColor: `${meta?.color ?? "#64748b"}1a`,
                  }}
                >
                  {meta?.shortName ?? ""}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {formatAmount(tok.balance, tok.balance < 1 ? 6 : 4)} {tok.symbol}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white">
                {tok.priceUsd > 0 ? formatCurrency(tok.priceUsd) : "—"}
              </p>
              {tok.change24h !== undefined && tok.change24h !== 0 && (
                <p
                  className={`text-xs ${
                    tok.change24h >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {tok.change24h >= 0 ? "+" : ""}
                  {formatAmount(tok.change24h, 2)}%
                </p>
              )}
            </div>
            <div className="w-20 text-right">
              <p className="text-sm font-semibold text-white">{formatCurrency(tok.valueUsd)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}