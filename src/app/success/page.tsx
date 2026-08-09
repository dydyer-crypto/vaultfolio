"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSubscription } from "@/lib/useSubscription";

export default function SuccessPage() {
  const { t, dir } = useI18n();
  const { sub, tier, startCheckout } = useSubscription();
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => void sub, 2000);
  }, []);

  const isFr = dir === "ltr" && t("appName") === "Vaultfolio";

  const tr = (key: string) => {
    const fr: Record<string, string> = {
      title: "Paiement confirmé !",
      subtitle: "Votre abonnement est actif. Bienvenue dans Vaultfolio Pro.",
      back: "Aller à mon dashboard",
      upsellTitle: "Débloquez encore plus",
      upsellSubtitle: "Offres spéciales valables uniquement sur cette page",
      proToWhale: "Passez Whale",
      proToWhaleDesc: "20+ chaînes, 20 wallets, analytics PnL, white-label",
      proToWhalePrice: "+$20/mo",
      alerts: "Alertes Avancées",
      alertsDesc: "Liquidation risk, smart money tracking, alertes Telegram",
      alertsPrice: "+$5/mo",
      tax: "Export Fiscal",
      taxDesc: "CSV fiscal, PnL réalisé, export Koinly/CoinTracking",
      taxPrice: "$29 one-time",
      limited: "Offre de lancement — valable 24h",
      claimed: "Déjà activé",
    };
    const en: Record<string, string> = {
      title: "Payment confirmed!",
      subtitle: "Your subscription is active. Welcome to Vaultfolio Pro.",
      back: "Go to my dashboard",
      upsellTitle: "Unlock even more",
      upsellSubtitle: "Special offers available only on this page",
      proToWhale: "Upgrade to Whale",
      proToWhaleDesc: "20+ chains, 20 wallets, PnL analytics, white-label",
      proToWhalePrice: "+$20/mo",
      alerts: "Advanced Alerts",
      alertsDesc: "Liquidation risk, smart money tracking, Telegram alerts",
      alertsPrice: "+$5/mo",
      tax: "Tax Export",
      taxDesc: "Tax CSV, realized PnL, Koinly/CoinTracking export",
      taxPrice: "$29 one-time",
      limited: "Launch offer — 24h only",
      claimed: "Already activated",
    };
    return (isFr ? fr : en)[key] ?? key;
  };

  const handleWhale = async () => {
    setBusy("whale");
    try {
      await startCheckout("whale", "monthly");
    } catch {
      setBusy(null);
    }
  };

  return (
    <div dir={dir} className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {/* Confirmation */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-white">{tr("title")}</h1>
          <p className="mt-2 text-base text-slate-400">{tr("subtitle")}</p>
          <a
            href="/"
            className="pressable mt-6 inline-block rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
          >
            {tr("back")}
          </a>
        </div>

        {/* Upsells */}
        {tier !== "whale" && (
          <div className="mt-12">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white">{tr("upsellTitle")}</h2>
              <p className="mt-1 text-sm text-slate-400">{tr("upsellSubtitle")}</p>
            </div>

            <div className="mt-6 space-y-4">
              {/* Pro → Whale */}
              {tier === "pro" && (
                <div className="card-pressable overflow-hidden rounded-2xl border border-brand-500/30 bg-gradient-to-br from-brand-500/10 to-slate-900/40 p-6 shadow-lg shadow-brand-500/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-white">{tr("proToWhale")}</h3>
                        <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          {tr("proToWhalePrice")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-400">{tr("proToWhaleDesc")}</p>
                    </div>
                    <button
                      onClick={handleWhale}
                      disabled={busy === "whale"}
                      className="pressable flex-shrink-0 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500 disabled:opacity-50"
                    >
                      {busy === "whale" ? "…" : tr("proToWhale")}
                    </button>
                  </div>
                </div>
              )}

              {/* Alerts add-on */}
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{tr("alerts")}</h3>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {tr("alertsPrice")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{tr("alertsDesc")}</p>
                </div>
                <button
                  disabled
                  className="flex-shrink-0 cursor-not-allowed rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-500"
                  title="Coming soon"
                >
                  {tr("claimed")}
                </button>
              </div>

              {/* Tax export */}
              <div className="flex items-start justify-between gap-4 rounded-2xl border border-white/5 bg-slate-900/40 p-6">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{tr("tax")}</h3>
                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300">
                      {tr("taxPrice")}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-400">{tr("taxDesc")}</p>
                </div>
                <button
                  disabled
                  className="flex-shrink-0 cursor-not-allowed rounded-xl border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-500"
                  title="Coming soon"
                >
                  {tr("claimed")}
                </button>
              </div>
            </div>

            <p className="mt-4 text-center text-xs text-amber-400">⏱ {tr("limited")}</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}