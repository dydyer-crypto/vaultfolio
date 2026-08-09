"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export interface Alert {
  id: string;
  coinId: string;
  symbol: string;
  condition: "above" | "below";
  targetPrice: number;
  email: string;
  createdAt: number;
  triggered: boolean;
}

export function useAlerts(enabled: boolean) {
  const { address } = useAccount();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!address || !enabled) {
      setAlerts([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`/api/alerts?address=${address}`);
      if (res.ok) {
        const data = (await res.json()) as { alerts: Alert[] };
        setAlerts(data.alerts);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [address, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createAlert = useCallback(
    async (params: {
      coinId: string;
      symbol: string;
      condition: "above" | "below";
      targetPrice: number;
      email: string;
    }) => {
      if (!address) throw new Error("Wallet not connected");
      const res = await fetch("/api/alerts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          address,
          action: "create",
          alert: params,
        }),
      });
      if (!res.ok) throw new Error("Failed to create alert");
      await refresh();
    },
    [address, refresh]
  );

  const deleteAlert = useCallback(
    async (alertId: string) => {
      await fetch("/api/alerts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address, action: "delete", alertId }),
      });
      await refresh();
    },
    [address, refresh]
  );

  return { alerts, loading, refresh, createAlert, deleteAlert };
}