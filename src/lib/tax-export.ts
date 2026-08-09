import type { TokenBalance } from "@/lib/prices";
import { chainMeta } from "@/lib/chains";

function escapeCsv(value: string | number | boolean): string {
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function downloadTaxCsv(tokens: TokenBalance[]): void {
  const headers = [
    "Date",
    "Platform",
    "Asset",
    "Asset Name",
    "Amount",
    "Price (USD)",
    "Value (USD)",
    "Chain",
    "Token Address",
    "Type",
  ];

  const now = new Date().toISOString().slice(0, 10);

  const rows = tokens.map((t) => [
    now,
    "Vaultfolio",
    t.symbol,
    t.name,
    t.balance.toFixed(8),
    t.priceUsd.toFixed(6),
    t.valueUsd.toFixed(2),
    chainMeta[t.chainId as keyof typeof chainMeta]?.name ?? String(t.chainId),
    t.tokenAddress ?? "",
    t.isNative ? "native" : t.isDefi ? "defi" : "erc20",
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.map(escapeCsv).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  triggerDownload(blob, `vaultfolio-tax-${now}.csv`);
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