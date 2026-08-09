"use client";

import { useEffect, useState } from "react";

export interface BrandConfig {
  name: string;
  logoUrl?: string;
  color?: string;
  tagline?: string;
}

const STORAGE_KEY = "vaultfolio:whitelabel";

function parseUrl(): BrandConfig | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const brand = params.get("brand");
  if (!brand) return null;
  return {
    name: brand,
    logoUrl: params.get("logo") ?? undefined,
    color: params.get("color") ?? undefined,
    tagline: params.get("tagline") ?? undefined,
  };
}

export function useBrand(): BrandConfig | null {
  const [brand, setBrand] = useState<BrandConfig | null>(null);

  useEffect(() => {
    const parsed = parseUrl();
    if (parsed) {
      setBrand(parsed);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBrand(JSON.parse(stored) as BrandConfig);
      } catch {
        // ignore
      }
    }
  }, []);

  return brand;
}

export function clearBrand(): void {
  localStorage.removeItem(STORAGE_KEY);
  if (typeof window !== "undefined") {
    const url = new URL(window.location.href);
    url.searchParams.delete("brand");
    url.searchParams.delete("logo");
    url.searchParams.delete("color");
    url.searchParams.delete("tagline");
    window.history.replaceState({}, "", url.toString());
  }
}