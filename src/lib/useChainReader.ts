"use client";

import { useCallback, useMemo } from "react";
import { createPublicClient, erc20Abi, http, type Address, type PublicClient } from "viem";
import {
  arbitrum, avalanche, base, blast, bsc, celo, cronos, fantom, gnosis,
  kava, linea, mainnet, mantle, moonbeam, moonriver, optimism, polygon,
  scroll, zkSync,
} from "wagmi/chains";
import { usePublicClient } from "wagmi";
import { chainMeta, type ChainId } from "@/lib/chains";
import { defiTokens, isDefiToken, knownTokens, nativeTokenByChain } from "@/lib/tokens";
import type { NftAsset, TokenBalance } from "@/lib/prices";

const chainById = {
  1: mainnet,
  137: polygon,
  8453: base,
  42161: arbitrum,
  10: optimism,
  43114: avalanche,
  56: bsc,
  81457: blast,
  42220: celo,
  25: cronos,
  250: fantom,
  100: gnosis,
  2222: kava,
  59144: linea,
  5000: mantle,
  1284: moonbeam,
  1285: moonriver,
  534352: scroll,
  324: zkSync,
} as const;

const rpcUrls: Record<number, string> = {
  1: "https://eth.llamarpc.com",
  137: "https://polygon-rpc.com",
  8453: "https://mainnet.base.org",
  42161: "https://arb1.arbitrum.io/rpc",
  10: "https://mainnet.optimism.io",
  43114: "https://api.avax.network/ext/bc/C/rpc",
  56: "https://bsc-dataseed.binance.org",
  81457: "https://rpc.blast.io",
  42220: "https://forno.celo.org",
  25: "https://evm.cronos.org",
  250: "https://rpc.ftm.tools",
  100: "https://rpc.gnosischain.com",
  2222: "https://evm.kava.io",
  59144: "https://rpc.linea.build",
  5000: "https://rpc.mantle.xyz",
  1284: "https://rpc.api.moonbeam.network",
  1285: "https://rpc.api.moonriver.moonbeam.network",
  534352: "https://rpc.scroll.io",
  324: "https://mainnet.era.zksync.io",
};

export function useChainReader() {
  const defaultClient = usePublicClient();

  const clients = useMemo(() => {
    const map = new Map<ChainId, PublicClient>();
    (Object.keys(chainMeta) as unknown as ChainId[]).forEach((cid) => {
      const chain = chainById[cid as keyof typeof chainById];
      if (!chain) return;
      map.set(
        cid,
        createPublicClient({
          chain,
          transport: http(rpcUrls[cid]),
        }) as PublicClient
      );
    });
    return map;
  }, []);

  const readBalance = useCallback(
    async (chainId: ChainId, account: Address): Promise<TokenBalance[]> => {
      const client = clients.get(chainId);
      if (!client) return [];
      const meta = chainMeta[chainId];
      if (!meta) return [];

      const results: TokenBalance[] = [];

      const native = nativeTokenByChain[chainId];
      if (native) {
        try {
          const bal = await client.getBalance({ address: account });
          const balance = Number(bal) / 1e18;
          results.push({
            chainId,
            symbol: native.symbol,
            name: native.name,
            balance,
            priceUsd: 0,
            valueUsd: 0,
            explorer: meta.explorer,
            isNative: true,
            logo: undefined,
            change24h: undefined,
            isDefi: false,
          });
        } catch {
          // ignore
        }
      }

      const allTokens = [...(knownTokens[chainId] ?? []), ...(defiTokens[chainId] ?? [])];
      const calls = allTokens.map((t) => ({
        address: t.address,
        abi: erc20Abi,
        functionName: "balanceOf" as const,
        args: [account] as const,
      }));

      try {
        const balances = await client.multicall({ contracts: calls });
        balances.forEach((res, i) => {
          const raw = res.result as bigint | undefined;
          const token = allTokens[i];
          if (!token || raw === undefined) return;
          const balance = Number(raw) / 10 ** token.decimals;
          if (balance > 0) {
            results.push({
              chainId,
              symbol: token.symbol,
              name: token.name,
              balance,
              priceUsd: 0,
              valueUsd: 0,
              logo: token.logo,
              explorer: meta.explorer,
              tokenAddress: token.address,
              isNative: false,
              change24h: undefined,
              isDefi: isDefiToken(chainId, token.address),
            });
          }
        });
      } catch {
        for (const token of allTokens) {
          try {
            const raw = (await client.readContract({
              address: token.address,
              abi: erc20Abi,
              functionName: "balanceOf",
              args: [account],
            })) as bigint;
            const balance = Number(raw) / 10 ** token.decimals;
            if (balance > 0) {
              results.push({
                chainId,
                symbol: token.symbol,
                name: token.name,
                balance,
                priceUsd: 0,
                valueUsd: 0,
                logo: token.logo,
                explorer: meta.explorer,
                tokenAddress: token.address,
                isNative: false,
                change24h: undefined,
                isDefi: isDefiToken(chainId, token.address),
              });
            }
          } catch {
            // skip
          }
        }
      }

      return results;
    },
    [clients]
  );

  const readNfts = useCallback(
    async (_chainId: ChainId, account: Address): Promise<NftAsset[]> => {
      const meta = chainMeta[_chainId];
      if (!meta) return [];
      try {
        const res = await fetch(
          `https://eth-mainnet.g.alchemy.com/nft/v3/demo/getNFTsForOwner?owner=${account}&pageSize=24`,
          { headers: { accept: "application/json" } }
        );
        if (!res.ok) return [];
        const data = (await res.json()) as {
          ownedNfts?: Array<{
            contract: { address: string };
            id: { tokenId: string };
            title: string;
            media?: Array<{ gateway?: string; raw?: string }>;
            contractMetadata?: { name?: string; openSea?: { imageUrl?: string } };
          }>;
        };
        return (data.ownedNfts ?? []).map((n) => {
          const img =
            n.media?.[0]?.gateway ??
            n.media?.[0]?.raw ??
            n.contractMetadata?.openSea?.imageUrl ??
            "";
          return {
            chainId: _chainId,
            contract: n.contract.address as Address,
            tokenId: n.id.tokenId,
            name: n.title || "Untitled",
            image: img,
            collection: n.contractMetadata?.name || "Unknown",
            explorer: meta.explorer,
          };
        });
      } catch {
        return [];
      }
    },
    []
  );

  return { readBalance, readNfts, defaultClient };
}