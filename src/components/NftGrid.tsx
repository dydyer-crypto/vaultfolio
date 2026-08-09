"use client";

import Image from "next/image";
import { useI18n } from "@/i18n/I18nProvider";
import { chainMeta, type ChainId } from "@/lib/chains";
import { shortName } from "@/lib/format";
import type { NftAsset } from "@/lib/prices";

interface NftGridProps {
  nfts: NftAsset[];
  loading: boolean;
}

export function NftGrid({ nfts, loading }: NftGridProps) {
  const { t } = useI18n();

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-white/5 bg-slate-900/40"
          >
            <div className="aspect-square animate-pulse bg-slate-700/60" />
            <div className="space-y-1.5 p-2">
              <div className="h-2.5 w-20 animate-pulse rounded bg-slate-700/60" />
              <div className="h-2 w-16 animate-pulse rounded bg-slate-700/40" />
            </div>
          </div>
        ))}
        <p className="col-span-full py-2 text-center text-xs text-slate-500">{t("loadingNfts")}</p>
      </div>
    );
  }

  if (nfts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/10 bg-slate-900/30 p-8 text-center">
        <p className="text-sm text-slate-400">{t("noNfts")}</p>
      </div>
    );
  }

  return (
    <div className="grid animate-stagger grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {nfts.slice(0, 24).map((nft, i) => {
        const meta = chainMeta[nft.chainId as ChainId];
        return (
          <a
            key={`${nft.contract}-${nft.tokenId}-${i}`}
            href={`${meta?.explorer}/token/${nft.contract}?a=${nft.tokenId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="card-pressable lift-on-hover group overflow-hidden rounded-xl border border-white/5 bg-slate-900/40 transition hover:border-white/10 hover:bg-slate-900/70"
          >
            <div className="relative aspect-square overflow-hidden bg-slate-800">
              {nft.image ? (
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  sizes="(max-width:640px) 50vw, 25vw"
                  className="object-cover transition group-hover:scale-105"
                  unoptimized
                />
              ) : (
                <div className="flex h-full items-center justify-center text-slate-600">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-xs font-medium text-white">{shortName(nft.name, 18)}</p>
              <p className="truncate text-[10px] text-slate-400">{shortName(nft.collection, 16)}</p>
            </div>
          </a>
        );
      })}
    </div>
  );
}