export function formatAmount(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) return "0";
  if (value === 0) return "0";
  if (value < 0.01) return value.toPrecision(4);
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

export function formatCurrency(value: number, currency = "USD"): string {
  if (!Number.isFinite(value)) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

export function formatTokenBalance(raw: bigint, decimals: number): number {
  return Number(raw) / 10 ** decimals;
}

export function shortAddress(addr: string, chars = 4): string {
  if (!addr) return "";
  return `${addr.slice(0, 2 + chars)}…${addr.slice(-chars)}`;
}

export function shortName(name: string, max = 16): string {
  if (!name) return "Unknown";
  return name.length > max ? `${name.slice(0, max)}…` : name;
}

export function cn(...classes: Array<string | false | undefined | null>): string {
  return classes.filter(Boolean).join(" ");
}