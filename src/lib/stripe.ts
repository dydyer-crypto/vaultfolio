import Stripe from "stripe";

export type Tier = "free" | "pro" | "whale";

export interface TierConfig {
  id: Tier;
  name: string;
  priceMonthly: number;
  priceYearly: number;
  stripePriceId: string | null;
  features: string[];
  maxChains: number;
  maxWallets: number;
  alerts: boolean;
  defiPositions: boolean;
  csvExport: boolean;
  highlight?: boolean;
}

export const tiers: Record<Tier, TierConfig> = {
  free: {
    id: "free",
    name: "Starter",
    priceMonthly: 0,
    priceYearly: 0,
    stripePriceId: null,
    maxChains: 2,
    maxWallets: 1,
    alerts: false,
    defiPositions: false,
    csvExport: false,
    features: [
      "2 chains (Ethereum + Polygon)",
      "1 wallet",
      "ERC-20 + native balances",
      "NFT collectibles",
      "Live CoinGecko prices",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    priceMonthly: 9,
    priceYearly: 79,
    stripePriceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    maxChains: 6,
    maxWallets: 3,
    alerts: true,
    defiPositions: true,
    csvExport: true,
    highlight: true,
    features: [
      "6 chains (Ethereum, Polygon, Base, Arbitrum, Optimism, Avalanche)",
      "3 wallets",
      "DeFi positions (Uniswap, Aave, Compound)",
      "Price alerts (email + webhook)",
      "CSV / JSON export",
      "24h portfolio history",
    ],
  },
  whale: {
    id: "whale",
    name: "Whale",
    priceMonthly: 29,
    priceYearly: 279,
    stripePriceId: process.env.STRIPE_PRICE_WHALE_MONTHLY ?? null,
    maxChains: 20,
    maxWallets: 20,
    alerts: true,
    defiPositions: true,
    csvExport: true,
    highlight: false,
    features: [
      "20+ chains — unlimited",
      "20 wallets",
      "All DeFi positions",
      "Real-time alerts (Telegram + email)",
      "Full export (CSV / JSON / PDF)",
      "Portfolio analytics + PnL history",
      "Priority RPC routing",
      "White-label dashboard URL",
    ],
  },
};

export const tierOrder: Tier[] = ["free", "pro", "whale"];

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  return new Stripe(key, { apiVersion: "2024-06-20" as Stripe.LatestApiVersion });
}

export { getStripe };

export function tierFromStripePrice(priceId: string | undefined): Tier {
  if (!priceId) return "free";
  if (priceId === tiers.pro.stripePriceId) return "pro";
  if (priceId === tiers.whale.stripePriceId) return "whale";
  return "free";
}

export interface SubscriptionStatus {
  tier: Tier;
  status: "none" | "active" | "past_due" | "canceled" | "trialing";
  currentPeriodEnd: number | null;
  cancelAtPeriodEnd: boolean;
}

export const freeSubscription: SubscriptionStatus = {
  tier: "free",
  status: "none",
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
};