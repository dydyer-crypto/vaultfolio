"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useI18n } from "@/i18n/I18nProvider";
import { tiers, tierOrder, type Tier } from "@/lib/stripe";
import { useSubscription } from "@/lib/useSubscription";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExitIntentPopup } from "@/components/ExitIntentPopup";
import { cn } from "@/lib/format";

const SITE_URL = "https://vaultfolio.app";

export default function PricingPage() {
  const { t, dir } = useI18n();
  const { address, isConnected } = useAccount();
  const { sub, isPaid, startCheckout, cancel, loading: subLoading } = useSubscription();
  const [period, setPeriod] = useState<"monthly" | "yearly">("monthly");
  const [busy, setBusy] = useState<string | null>(null);

  const handleUpgrade = async (tier: Tier, p: "monthly" | "yearly") => {
    setBusy(tier);
    try {
      await startCheckout(tier, p);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Checkout failed");
      setBusy(null);
    }
  };

  const pricingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Vaultfolio",
    description: "Multi-chain Web3 portfolio dashboard for European investors",
    url: `${SITE_URL}/pricing`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "0",
      highPrice: "29",
      offerCount: "3",
      offers: [
        { "@type": "Offer", name: "Starter", price: "0", priceCurrency: "USD" },
        { "@type": "Offer", name: "Pro", price: "9", priceCurrency: "USD" },
        { "@type": "Offer", name: "Whale", price: "29", priceCurrency: "USD" },
      ],
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE_URL}/pricing` },
    ],
  };

  return (
    <div dir={dir} className="min-h-screen">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </head>
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("pricingTitle")}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400 sm:text-base">
            {t("pricingSubtitle")}
          </p>
        </div>

        {/* Billing toggle */}
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPeriod("monthly")}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium transition",
              period === "monthly"
                ? "bg-brand-500 text-white"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
            )}
          >
            {t("billingMonthly")}
          </button>
          <button
            onClick={() => setPeriod("yearly")}
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition",
              period === "yearly"
                ? "bg-brand-500 text-white"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20"
            )}
          >
            {t("billingYearly")}
            <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              {t("saveYearly")}
            </span>
          </button>
        </div>

        {/* Plans */}
        <div className="mt-10 grid animate-stagger gap-5 md:grid-cols-3">
          {tierOrder.map((tierId) => {
            const tier = tiers[tierId];
            const isCurrent = sub.tier === tierId;
            const price = period === "yearly" ? tier.priceYearly : tier.priceMonthly;
            const periodLabel = period === "yearly" ? t("perYear") : t("perMonth");
            const tierName = t(tierId as Tier);

            return (
              <div
                key={tierId}
                className={cn(
                  "card-pressable relative flex flex-col rounded-2xl border p-6",
                  tier.highlight
                    ? "border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-slate-900/40 shadow-lg shadow-brand-500/10"
                    : "border-white/5 bg-slate-900/40"
                )}
              >
                {tier.highlight && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {t("mostPopular")}
                  </span>
                )}
                <div className="mb-1 text-sm font-semibold uppercase tracking-wider text-slate-400">
                  {tierName}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white">
                    ${price}
                  </span>
                  {price > 0 && <span className="text-sm text-slate-400">{periodLabel}</span>}
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {tierId === "free" ? t("planFree") : tierId === "pro" ? t("planPro") : t("planWhale")}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {tier.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <svg
                        className="mt-0.5 flex-shrink-0 text-emerald-400"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex-1" />

                {!isConnected ? (
                  <ConnectButton.Custom>
                    {({ openConnectModal, mounted }) => (
                      <button
                        {...(!mounted ? { "aria-hidden": true, style: { opacity: 0 } } : {})}
                        onClick={openConnectModal}
                        className={cn(
                          "pressable w-full rounded-xl px-4 py-2.5 text-sm font-semibold",
                          tier.highlight
                            ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500"
                            : "border border-white/10 text-slate-200 hover:border-white/20"
                        )}
                      >
                        {t("connectWallet")}
                      </button>
                    )}
                  </ConnectButton.Custom>
                ) : isCurrent ? (
                  <div className="flex flex-col gap-2">
                    <span className="rounded-xl bg-emerald-500/10 px-4 py-2.5 text-center text-sm font-semibold text-emerald-400">
                      {t("currentPlan")}
                    </span>
                    {tierId !== "free" && (
                      <button
                        onClick={() => void cancel()}
                        disabled={subLoading}
                        className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:border-rose-500/30 hover:text-rose-400 disabled:opacity-50"
                      >
                        {t("cancelSubscription")}
                      </button>
                    )}
                  </div>
                ) : tierId === "free" ? (
                  <span className="rounded-xl border border-white/10 px-4 py-2.5 text-center text-sm font-medium text-slate-400">
                    {t("currentPlan") === "Current plan" ? "Included" : "Inclus"}
                  </span>
                ) : (
                  <button
                    onClick={() => void handleUpgrade(tierId, period)}
                    disabled={busy === tierId}
                    className={cn(
                      "w-full rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50",
                      tier.highlight
                        ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500"
                        : "border border-white/10 text-slate-200 hover:border-white/20"
                    )}
                  >
                    {busy === tierId ? "…" : t("upgradeCta")}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison table */}
        <div className="mt-12 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("features")}
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("starter")}
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-brand-400">
                  {t("pro")}
                </th>
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {t("whale")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { label: t("chains"), free: "2", pro: "6", whale: "20+" },
                { label: t("assets"), free: "✓", pro: "✓", whale: "✓" },
                { label: t("nfts"), free: "✓", pro: "✓", whale: "✓" },
                { label: t("premiumDeFi"), free: "—", pro: "✓", whale: "✓" },
                { label: t("premiumAlerts"), free: "—", pro: "✓", whale: "✓" },
                { label: t("premiumExport"), free: "—", pro: "✓", whale: "✓" },
                { label: t("premiumHistory"), free: "—", pro: "✓", whale: "✓" },
                { label: t("premiumAnalytics"), free: "—", pro: "—", whale: "✓" },
                { label: t("premiumPriority"), free: "—", pro: "—", whale: "✓" },
                { label: t("premiumWhiteLabel"), free: "—", pro: "—", whale: "✓" },
                { label: t("address") === "Adresse" ? "Wallets" : "Wallets", free: "1", pro: "3", whale: "20" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40">
                  <td className="px-3 py-2.5 text-slate-300">{row.label}</td>
                  <td className="px-3 py-2.5 text-center text-slate-500">{row.free}</td>
                  <td className="px-3 py-2.5 text-center text-brand-300">{row.pro}</td>
                  <td className="px-3 py-2.5 text-center text-slate-300">{row.whale}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Sub status banner */}
        {isConnected && isPaid && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-5 py-3 text-center">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm text-slate-300">
              {t("subscribed")} — {t(sub.tier as Tier)} {t("planPro") === "Forfait Pro" ? "actif" : ""}
            </span>
            {sub.cancelAtPeriodEnd && sub.currentPeriodEnd && (
              <span className="text-xs text-amber-400">
                {t("subCancelAt")} ({new Date(sub.currentPeriodEnd).toLocaleDateString()})
              </span>
            )}
          </div>
        )}

        <div className="mt-10 text-center">
          <a href="/" className="text-sm text-brand-400 hover:text-brand-300">
            {t("backToDashboard")} →
          </a>
        </div>
      </main>
      <Footer />
      <ExitIntentPopup />
    </div>
  );
}