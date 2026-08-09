import { Redis } from "@upstash/redis";

export interface PriceAlert {
  id: string;
  address: string;
  coinId: string;
  symbol: string;
  condition: "above" | "below";
  targetPrice: number;
  email: string;
  createdAt: number;
  triggered: boolean;
}

const ALERT_PREFIX = "vaultfolio:alert:";
const INDEX_KEY = "vaultfolio:alerts:index";

let redis: Redis | null = null;

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) redis = new Redis({ url, token });
  return redis;
}

export async function createAlert(alert: Omit<PriceAlert, "id" | "createdAt" | "triggered">): Promise<PriceAlert | null> {
  const r = getRedis();
  if (!r) return null;
  const id = `al_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const full: PriceAlert = { ...alert, id, createdAt: Date.now(), triggered: false };
  try {
    await r.set(`${ALERT_PREFIX}${id}`, full);
    await r.sadd(INDEX_KEY, id);
    return full;
  } catch {
    return null;
  }
}

export async function listAlerts(address: string): Promise<PriceAlert[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const ids = (await r.smembers(INDEX_KEY)) as string[];
    const alerts: PriceAlert[] = [];
    for (const id of ids) {
      const alert = (await r.get<PriceAlert>(`${ALERT_PREFIX}${id}`)) as PriceAlert | null;
      if (alert && alert.address.toLowerCase() === address.toLowerCase() && !alert.triggered) {
        alerts.push(alert);
      }
    }
    return alerts.sort((a, b) => b.createdAt - a.createdAt);
  } catch {
    return [];
  }
}

export async function deleteAlert(id: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    await r.del(`${ALERT_PREFIX}${id}`);
    await r.srem(INDEX_KEY, id);
  } catch {
    // ignore
  }
}

export async function getAllAlerts(): Promise<PriceAlert[]> {
  const r = getRedis();
  if (!r) return [];
  try {
    const ids = (await r.smembers(INDEX_KEY)) as string[];
    const alerts: PriceAlert[] = [];
    for (const id of ids) {
      const alert = (await r.get<PriceAlert>(`${ALERT_PREFIX}${id}`)) as PriceAlert | null;
      if (alert && !alert.triggered) alerts.push(alert);
    }
    return alerts;
  } catch {
    return [];
  }
}

export async function markAlertTriggered(id: string): Promise<void> {
  const r = getRedis();
  if (!r) return;
  try {
    const alert = (await r.get<PriceAlert>(`${ALERT_PREFIX}${id}`)) as PriceAlert | null;
    if (alert) {
      await r.set(`${ALERT_PREFIX}${id}`, { ...alert, triggered: true });
    }
  } catch {
    // ignore
  }
}