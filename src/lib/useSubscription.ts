"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { freeSubscription, type SubscriptionStatus, type Tier } from "@/lib/stripe";

export function useSubscription() {
  const { address, isConnected } = useAccount();
  const [sub, setSub] = useState<SubscriptionStatus>(freeSubscription);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!address) {
      setSub(freeSubscription);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/check-subscription", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ address }),
      });
      if (res.ok) {
        const data = (await res.json()) as SubscriptionStatus;
        setSub(data);
      } else {
        setSub(freeSubscription);
      }
    } catch {
      setSub(freeSubscription);
    } finally {
      setLoading(false);
    }
  }, [address]);

  useEffect(() => {
    if (isConnected && address) {
      void refresh();
    } else {
      setSub(freeSubscription);
      setLoading(false);
    }
  }, [isConnected, address, refresh]);

  const startCheckout = useCallback(
    async (tier: Tier, period: "monthly" | "yearly") => {
      if (!address) throw new Error("Wallet not connected");
      const res = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tier, period, address }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error ?? "Checkout failed");
      }
    },
    [address]
  );

  const cancel = useCallback(async () => {
    if (!address) return;
    await fetch("/api/cancel-subscription", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ address }),
    });
    await refresh();
  }, [address, refresh]);

  return {
    sub,
    loading,
    tier: sub.tier,
    isFree: sub.tier === "free",
    isPro: sub.tier === "pro",
    isWhale: sub.tier === "whale",
    isPaid: sub.tier !== "free",
    refresh,
    startCheckout,
    cancel,
  };
}