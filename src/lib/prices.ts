import type { Address } from "viem";

export interface PriceMap {
  [coinGeckoId: string]: { usd: number; usd_24h_change?: number };
}

const CG_BASE = "https://api.coingecko.com/api/v3/simple/price";

export async function fetchPrices(coinIds: string[]): Promise<PriceMap> {
  const unique = Array.from(new Set(coinIds.filter(Boolean)));
  if (unique.length === 0) return {};

  const url = `${CG_BASE}?ids=${unique.join(",")}&vs_currencies=usd&include_24hr_change=true`;
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
    return (await res.json()) as PriceMap;
  } catch (err) {
    return {};
  }
}

export interface TokenBalance {
  chainId: number;
  symbol: string;
  name: string;
  balance: number;
  priceUsd: number;
  valueUsd: number;
  logo?: string;
  explorer: string;
  tokenAddress?: Address;
  isNative: boolean;
  change24h?: number;
  isDefi?: boolean;
}

export interface NftAsset {
  chainId: number;
  contract: Address;
  tokenId: string;
  name: string;
  image: string;
  collection: string;
  explorer: string;
}