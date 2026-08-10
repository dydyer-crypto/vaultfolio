"use client";

import { useState } from "react";
import { useAlerts, type Alert } from "@/lib/useAlerts";
import { useI18n } from "@/i18n/I18nProvider";
import type { TokenBalance } from "@/lib/prices";

interface AlertsPanelProps {
  tokens: TokenBalance[];
  enabled: boolean;
}

export function AlertsPanel({ tokens, enabled }: AlertsPanelProps) {
  const { t, dir } = useI18n();
  const { alerts, createAlert, deleteAlert, loading } = useAlerts(enabled);
  const [coinId, setCoinId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [targetPrice, setTargetPrice] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const trad = (key: "alertsLabel" | "createAlert" | "condition" | "target" | "email" | "delete") => {
    const m: Record<string, string> = {
      alertsLabel: t("address") === "Adresse" ? "Mes alertes" : "My alerts",
      createAlert: t("address") === "Adresse" ? "Créer une alerte" : "Create alert",
      condition: t("address") === "Adresse" ? "Condition" : "Condition",
      target: t("address") === "Adresse" ? "Prix cible ($)" : "Target price ($)",
      email: t("address") === "Adresse" ? "Email" : "Email",
      delete: t("cancelSubscription") === "Annuler l'abonnement" ? "Supprimer" : "Delete",
    };
    return m[key];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const price = parseFloat(targetPrice);
    if (!coinId || !symbol || !email || isNaN(price) || price <= 0) {
      setError("All fields required");
      return;
    }
    try {
      await createAlert({ coinId, symbol, condition, targetPrice: price, email });
      setCoinId("");
      setSymbol("");
      setTargetPrice("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    }
  };

  if (!enabled) {
    return (
      <div className="rounded-xl border border-dashed border-brand-500/20 bg-brand-500/5 p-5 text-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2 text-brand-400">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <p className="text-sm font-medium text-white">{trad("alertsLabel")}</p>
        <p className="mt-1 text-xs text-slate-400">{t("premiumAlerts")}</p>
        <a href="/pricing" className="mt-3 inline-block rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2 text-xs font-semibold text-white transition hover:from-brand-400 hover:to-brand-500">
          {t("upgradeCta")}
        </a>
      </div>
    );
  }

  return (
    <div dir={dir} className="space-y-4">
      {/* Existing alerts */}
      {loading ? (
        <p className="text-xs text-slate-500">…</p>
      ) : alerts.length > 0 ? (
        <div className="space-y-1.5">
          {alerts.map((a: Alert) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-white/5 bg-slate-900/40 p-2.5 text-xs">
              <span className="text-slate-300">
                <span className="font-medium text-white">{a.symbol}</span>{" "}
                <span className="text-slate-400">{a.condition}</span>{" "}
                <span className="font-medium text-white">${a.targetPrice}</span>
              </span>
              <button
                onClick={() => void deleteAlert(a.id)}
                className="pressable flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:text-rose-400"
                aria-label="Delete alert"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-slate-500">No alerts yet.</p>
      )}

      {/* Create form */}
      <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-white/5 bg-slate-900/40 p-3">
        <p className="text-xs font-semibold text-slate-300">{trad("createAlert")}</p>
        <select
          value={`${coinId}|${symbol}`}
          onChange={(e) => {
            const [id, sym] = e.target.value.split("|");
            setCoinId(id);
            setSymbol(sym);
          }}
          className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
        >
          <option value="|">Select token…</option>
          {tokens.filter((t) => t.priceUsd > 0).map((t, i) => {
            const native = t.isNative
              ? (t.chainId === 137 ? "matic-network" : t.chainId === 43114 ? "avalanche-2" : "ethereum")
              : "";
            const cgId = t.isNative ? native : (t.tokenAddress ? `erc-${t.tokenAddress}` : "");
            const realCgId = t.isNative ? native : cgId;
            return (
              <option key={i} value={`${realCgId || t.symbol.toLowerCase()}|${t.symbol}`}>
                {t.symbol} ({t.name}) — ${t.priceUsd.toFixed(4)}
              </option>
            );
          })}
        </select>
        <div className="flex gap-2">
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as "above" | "below")}
            className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
          >
            <option value="above">≥ above</option>
            <option value="below">≤ below</option>
          </select>
          <input
            type="number"
            step="0.01"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder={trad("target")}
            className="flex-1 rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
          />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={trad("email")}
          className="w-full rounded-lg border border-white/10 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-brand-500"
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
        <button
          type="submit"
          className="w-full rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-400"
        >
          {trad("createAlert")}
        </button>
      </form>
    </div>
  );
}