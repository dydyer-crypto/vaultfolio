import { Redis } from "@upstash/redis";
import type { SubscriptionStatus } from "@/lib/stripe";
import { freeSubscription } from "@/lib/stripe";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) {
    redis = new Redis({ url, token });
  }
  return redis;
}

const KEY_PREFIX = "vaultfolio:sub:";

export async function getSubscription(address: string): Promise<SubscriptionStatus> {
  const r = getRedis();
  if (!r) return freeSubscription;
  try {
    const data = (await r.get<SubscriptionStatus>(`${KEY_PREFIX}${address.toLowerCase()}`)) as
      | SubscriptionStatus
      | null;
    if (!data) return freeSubscription;

    if (
      data.status === "active" &&
      data.currentPeriodEnd &&
      data.currentPeriodEnd < Date.now()
    ) {
      return freeSubscription;
    }
    return data;
  } catch {
    return freeSubscription;
  }
}

export async function setSubscription(
  address: string,
  sub: SubscriptionStatus
): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.set(`${KEY_PREFIX}${address.toLowerCase()}`, sub);
  } catch {
    // ignore
  }
}

export async function deleteSubscription(address: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.del(`${KEY_PREFIX}${address.toLowerCase()}`);
  } catch {
    // ignore
  }
}

export async function setSubscriptionFromStripe(
  address: string,
  status: SubscriptionStatus["status"],
  currentPeriodEnd: number,
  cancelAtPeriodEnd: boolean,
  tier: SubscriptionStatus["tier"]
): Promise<void> {
  await setSubscription(address, { tier, status, currentPeriodEnd, cancelAtPeriodEnd });
}