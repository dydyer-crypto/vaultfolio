"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";

export interface WatchedWallet {
  address: string;
  label: string;
  isPrimary: boolean;
}

const STORAGE_KEY = "vaultfolio:wallets";

function loadWallets(): WatchedWallet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as WatchedWallet[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function saveWallets(wallets: WatchedWallet[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wallets));
}

export function useWallets(maxWallets: number) {
  const { address, isConnected } = useAccount();
  const [wallets, setWallets] = useState<WatchedWallet[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setWallets(loadWallets());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded && address) {
      setWallets((prev) => {
        const exists = prev.find((w) => w.address.toLowerCase() === address.toLowerCase());
        if (exists) return prev;
        const next = [
          ...prev,
          { address, label: `Wallet ${prev.length + 1}`, isPrimary: prev.length === 0 },
        ];
        saveWallets(next);
        return next;
      });
    }
  }, [address, loaded]);

  const addWallet = useCallback(
    (addr: string, label?: string) => {
      const normalized = addr.toLowerCase();
      if (!normalized.match(/^0x[a-f0-9]{40}$/)) {
        throw new Error("Invalid address");
      }
      setWallets((prev) => {
        if (prev.some((w) => w.address.toLowerCase() === normalized)) return prev;
        if (prev.length >= maxWallets) {
          throw new Error(`Limit reached (${maxWallets} wallets on your plan)`);
        }
        const next = [
          ...prev,
          { address: addr, label: label ?? `Wallet ${prev.length + 1}`, isPrimary: false },
        ];
        saveWallets(next);
        return next;
      });
    },
    [maxWallets]
  );

  const removeWallet = useCallback((addr: string) => {
    setWallets((prev) => {
      const next = prev.filter((w) => w.address.toLowerCase() !== addr.toLowerCase());
      if (next.length > 0 && !next.some((w) => w.isPrimary)) {
        next[0].isPrimary = true;
      }
      saveWallets(next);
      return next;
    });
  }, []);

  const renameWallet = useCallback((addr: string, label: string) => {
    setWallets((prev) => {
      const next = prev.map((w) =>
        w.address.toLowerCase() === addr.toLowerCase() ? { ...w, label } : w
      );
      saveWallets(next);
      return next;
    });
  }, []);

  const canAdd = wallets.length < maxWallets && isConnected;

  return {
    wallets,
    addresses: wallets.map((w) => w.address),
    addWallet,
    removeWallet,
    renameWallet,
    canAdd,
    loaded,
  };
}