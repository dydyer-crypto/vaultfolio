import type { TokenBalance, NftAsset } from "@/lib/prices";

function toCsv(tokens: TokenBalance[]): string {
  const headers = ["chain", "symbol", "name", "balance", "priceUsd", "valueUsd", "tokenAddress", "isNative", "isDefi"];
  const rows = tokens.map((t) => [
    t.chainId,
    t.symbol,
    t.name.replace(/,/g, ";"),
    t.balance,
    t.priceUsd,
    t.valueUsd.toFixed(2),
    t.tokenAddress ?? "",
    t.isNative,
    t.isDefi ?? false,
  ]);
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
}

export function downloadTokensCsv(tokens: TokenBalance[]): void {
  const csv = toCsv(tokens);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `vaultfolio-tokens-${Date.now()}.csv`);
}

export function downloadTokensJson(tokens: TokenBalance[]): void {
  const json = JSON.stringify(tokens, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, `vaultfolio-tokens-${Date.now()}.json`);
}

export function downloadNftsJson(nfts: NftAsset[]): void {
  const json = JSON.stringify(nfts, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  triggerDownload(blob, `vaultfolio-nfts-${Date.now()}.json`);
}

function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === "undefined") return;
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}