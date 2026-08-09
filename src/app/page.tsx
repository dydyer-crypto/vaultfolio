"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useI18n } from "@/i18n/I18nProvider";
import { getSalesCopy } from "@/content/salesCopy";
import { chainMeta, supportedChains, type ChainId } from "@/lib/chains";
import { useChainReader } from "@/lib/useChainReader";
import { fetchPrices, type NftAsset, type TokenBalance } from "@/lib/prices";
import { defiTokens, nativeTokenByChain, knownTokens } from "@/lib/tokens";
import { useSubscription } from "@/lib/useSubscription";
import { useWallets } from "@/lib/useWallets";
import { useHistory } from "@/lib/useHistory";
import { tiers } from "@/lib/stripe";
import { downloadTokensCsv, downloadTokensJson, downloadNftsJson } from "@/lib/export";
import { downloadTaxCsv } from "@/lib/tax-export";
import { Header } from "@/components/Header";
import { Footer, CopyAddressButton } from "@/components/Footer";
import { StatGrid } from "@/components/StatCard";
import { TokenList } from "@/components/TokenList";
import { NftGrid } from "@/components/NftGrid";
import { PaywallOverlay } from "@/components/PaywallOverlay";
import { PnLChart } from "@/components/PnLChart";
import { AlertsPanel } from "@/components/AlertsPanel";
import { UpsellModal } from "@/components/UpsellModal";
import { FintechHero } from "@/components/FintechHero";

export default function Page() {
  const { t, dir } = useI18n();
  const { address, isConnected, isReconnecting } = useAccount();
  const { readBalance, readNfts } = useChainReader();
  const { sub, isFree, isPaid } = useSubscription();
  const tierConfig = tiers[sub.tier];
  const { wallets, addWallet, removeWallet, canAdd } = useWallets(tierConfig.maxWallets);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallFeature, setPaywallFeature] = useState("");
  const [newWalletInput, setNewWalletInput] = useState("");
  const [walletError, setWalletError] = useState("");
  const [upsellTrigger, setUpsellTrigger] = useState<"max_wallets" | "nft_heavy" | "defi_heavy" | null>(null);

  const allowedChainIds = useMemo(() => {
    const all = supportedChains.map((c) => c.id);
    return all.slice(0, tierConfig.maxChains);
  }, [tierConfig.maxChains]);

  const [tokens, setTokens] = useState<TokenBalance[]>([]);
  const [nfts, setNfts] = useState<NftAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (wallets.length === 0) return;
    const isRefresh = tokens.length > 0 || nfts.length > 0;
    isRefresh ? setRefreshing(true) : setLoading(true);

    try {
      const chainIds = allowedChainIds as ChainId[];
      const allAddrs = wallets.map((w) => w.address as `0x${string}`);
      const [tokenRes, nftRes] = await Promise.all([
        Promise.all(
          allAddrs.flatMap((addr) => chainIds.map((cid) => readBalance(cid, addr)))
        ).then((r) => r.flat()),
        Promise.all(
          allAddrs.flatMap((addr) => chainIds.map((cid) => readNfts(cid, addr)))
        ).then((r) => r.flat()),
      ]);

      const coinIds = new Set<string>();
      for (const tok of tokenRes) {
        const native = nativeTokenByChain[tok.chainId];
        if (tok.isNative && native) coinIds.add(native.cgId);
        else {
          const allTokens = [...(knownTokens[tok.chainId] ?? []), ...(defiTokens[tok.chainId] ?? [])];
          const def = allTokens.find((d) => d.address === tok.tokenAddress);
          if (def?.cgId) coinIds.add(def.cgId);
        }
      }

      const prices = await fetchPrices(Array.from(coinIds));

      const priced = tokenRes.map((tok) => {
        const native = nativeTokenByChain[tok.chainId];
        const allTokens = [...(knownTokens[tok.chainId] ?? []), ...(defiTokens[tok.chainId] ?? [])];
        const cgId = tok.isNative ? native?.cgId : allTokens.find(
          (d) => d.address === tok.tokenAddress
        )?.cgId;
        const price = cgId ? prices[cgId]?.usd ?? 0 : 0;
        const change = cgId ? prices[cgId]?.usd_24h_change : undefined;
        return { ...tok, priceUsd: price, valueUsd: price * tok.balance, change24h: change };
      });

      priced.sort((a, b) => b.valueUsd - a.valueUsd);
      setTokens(priced);
      setNfts(nftRes);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [wallets, readBalance, readNfts, tokens.length, nfts.length, allowedChainIds]);

  useEffect(() => {
    if (isConnected && wallets.length > 0) {
      void load();
    } else if (!isConnected) {
      setTokens([]);
      setNfts([]);
    }
  }, [isConnected, wallets.length, load]);

  const netWorth = useMemo(
    () => tokens.reduce((sum, t) => sum + t.valueUsd, 0),
    [tokens]
  );
  const activeChains = useMemo(
    () => new Set(tokens.map((t) => t.chainId)).size || (isConnected ? supportedChains.length : 0),
    [tokens, isConnected]
  );

  const historyEnabled = tierConfig.defiPositions && isPaid;
  const { history, pnl } = useHistory(netWorth, tokens.length, nfts.length, historyEnabled);

  const nftCount = nfts.length;
  const defiCount = useMemo(() => tokens.filter((t) => t.isDefi).length, [tokens]);

  useEffect(() => {
    if (!isPaid || upsellTrigger) return;
    if (tierConfig.maxWallets <= 3 && wallets.length >= tierConfig.maxWallets) {
      setUpsellTrigger("max_wallets");
    } else if (nftCount >= 10) {
      setUpsellTrigger("nft_heavy");
    } else if (defiCount >= 3) {
      setUpsellTrigger("defi_heavy");
    }
  }, [isPaid, wallets.length, tierConfig.maxWallets, nftCount, defiCount, upsellTrigger]);

  if (!isConnected && !isReconnecting) {
    return (
      <div dir={dir} className="min-h-screen">
        <Header />
        <FintechHero />
        <LandingHero />
        <Footer />
      </div>
    );
  }

  return (
    <div dir={dir} className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        {/* Account bar */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-white sm:text-2xl">{t("portfolioOverview")}</h1>
            {address && <CopyAddressButton address={address} />}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Export buttons (Pro+ only) */}
            {isPaid && tokens.length > 0 && (
              <>
                <button
                  onClick={() => downloadTokensCsv(tokens)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/20"
                >
                  CSV
                </button>
                <button
                  onClick={() => downloadTokensJson(tokens)}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/20"
                >
                  JSON
                </button>
                <button
                  onClick={() => downloadTaxCsv(tokens)}
                  className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-500/40"
                  title="Koinly-compatible tax export"
                >
                  Tax
                </button>
              </>
            )}
            <button
              onClick={() => void load()}
              disabled={refreshing}
              className="pressable flex items-center gap-2 self-start rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-white/20 hover:text-white disabled:opacity-50"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={refreshing ? "animate-spin" : ""}
              >
                <path d="M21 12a9 9 0 11-2.64-6.36L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              {refreshing ? t("refreshing") : t("refresh")}
            </button>
            <a
              href="/pricing"
              className="pressable flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-brand-500 to-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
            >
              {isFree ? (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />
                  </svg>
                  {t("upgrade")}
                </>
              ) : (
                t("managePlan")
              )}
            </a>
          </div>
        </div>

        {/* Multi-wallet bar */}
        <div className="mb-6 material rounded-xl border border-white/5 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t("address") === "Adresse" ? "Mes wallets" : "My wallets"} ({wallets.length}/{tierConfig.maxWallets})
            </span>
            {wallets.map((w) => (
              <div key={w.address} className="flex items-center gap-1.5 rounded-lg bg-slate-800/60 px-2.5 py-1">
                <span className="text-xs text-slate-300">{w.label}</span>
                <span className="font-mono text-[10px] text-slate-500">
                  {w.address.slice(0, 6)}…{w.address.slice(-4)}
                </span>
                {wallets.length > 1 && (
                  <button
                    onClick={() => removeWallet(w.address)}
                    className="text-slate-500 transition hover:text-rose-400"
                    aria-label="Remove"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            {canAdd && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  try {
                    addWallet(newWalletInput);
                    setNewWalletInput("");
                    setWalletError("");
                  } catch (err) {
                    setWalletError(err instanceof Error ? err.message : "Error");
                  }
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={newWalletInput}
                  onChange={(e) => setNewWalletInput(e.target.value)}
                  placeholder="0x…"
                  className="w-36 rounded-lg border border-white/10 bg-slate-800 px-2 py-1 font-mono text-xs text-slate-200 outline-none focus:border-brand-500 sm:w-48"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-brand-500 px-3 py-1 text-xs font-semibold text-white transition hover:bg-brand-400"
                >
                  +
                </button>
              </form>
            )}
          </div>
          {walletError && <p className="mt-2 text-xs text-rose-400">{walletError}</p>}
          {isFree && (
            <p className="mt-2 text-xs text-slate-500">
              {tierConfig.maxWallets === 1
                ? t("premiumWallets")
                : ""}
            </p>
          )}
        </div>

        <StatGrid
          netWorth={netWorth}
          tokenCount={tokens.length}
          nftCount={nfts.length}
          chainCount={activeChains}
          loading={loading}
          t={t}
        />

        {/* PnL chart + alerts (Pro+ only, gated) */}
        {historyEnabled && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PnLChart history={history} pnl={pnl} />
            <div className="rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <AlertsPanel tokens={tokens} enabled={tierConfig.alerts && isPaid} />
            </div>
          </div>
        )}
        {!historyEnabled && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-dashed border-brand-500/20 bg-brand-500/5 p-4">
              <p className="text-xs font-medium text-white">{t("premiumHistory")}</p>
              <p className="mt-1 text-xs text-slate-400">{t("upgradeDesc")}</p>
            </div>
            <div className="rounded-xl border border-dashed border-brand-500/20 bg-brand-500/5 p-4">
              <p className="text-xs font-medium text-white">{t("premiumAlerts")}</p>
              <p className="mt-1 text-xs text-slate-400">{t("upgradeDesc")}</p>
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {t("assets")}
              </h2>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {tokens.length}
              </span>
            </div>
            <TokenList tokens={tokens} loading={loading} address={address ?? ""} />
          </section>
          <section>
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                {t("nfts")}
              </h2>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
                {nfts.length}
              </span>
            </div>
            <NftGrid nfts={nfts} loading={loading} />
          </section>
        </div>

        {/* Locked chains teaser for free users — value blocked counter */}
        {isFree && supportedChains.length > allowedChainIds.length && (() => {
          const lockedChains = supportedChains.length - allowedChainIds.length;
          const lockedNames = supportedChains
            .slice(allowedChainIds.length)
            .map((c) => chainMeta[c.id].name)
            .join(", ");
          const lockedFeatureLabel = `${lockedChains} ${t("chains").toLowerCase()} (${lockedNames})`;
          return (
            <div className="mt-6 overflow-hidden rounded-2xl border border-dashed border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-slate-900/40">
              <div className="p-6 text-center">
                <div className="mb-3 flex justify-center">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-brand-400">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                </div>
                <p className="text-base font-semibold text-white">{t("upgradeToUnlock")}</p>
                <p className="mt-1 text-sm text-slate-400">
                  {lockedChains} {t("chains").toLowerCase()} · {lockedNames}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {t("address") === "Adresse"
                    ? "Vos actifs sur ces chaînes ne sont pas suivis."
                    : "Your assets on these chains are not tracked."}
                </p>
                <button
                  onClick={() => {
                    setPaywallFeature(lockedFeatureLabel);
                    setPaywallOpen(true);
                  }}
                  className="mt-4 inline-block rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
                >
                  {t("upgradeCta")}
                </button>
              </div>
            </div>
          );
        })()}
      </main>
      <Footer />
      <PaywallOverlay
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        featureLabel={paywallFeature}
      />
      <UpsellModal
        trigger={upsellTrigger ?? "max_wallets"}
        open={upsellTrigger !== null}
        onClose={() => setUpsellTrigger(null)}
      />
    </div>
  );
}

function LandingHero() {
  const { locale, t } = useI18n();
  const c = getSalesCopy(locale);
  return (
    <main className="mx-auto max-w-4xl px-4 sm:px-6">

      {/* Social proof */}
      <section className="material border-y border-white/5 py-10">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">{c.socialProof.stat1Value}</p>
              <p className="mt-1 text-xs text-slate-400">{c.socialProof.stat1Label}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">{c.socialProof.stat2Value}</p>
              <p className="mt-1 text-xs text-slate-400">{c.socialProof.stat2Label}</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white sm:text-3xl">{c.socialProof.stat3Value}</p>
              <p className="mt-1 text-xs text-slate-400">{c.socialProof.stat3Label}</p>
            </div>
          </div>
          <p className="mt-6 text-sm text-slate-500">{c.socialProof.banner}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.howItWorksTitle}</h2>
        <div className="mx-auto mt-8 max-w-3xl">
          <ol className="grid gap-4 sm:grid-cols-3">
            {c.howItWorksSteps.map((step, i) => (
              <li key={i} className="rounded-2xl border border-white/5 bg-slate-900/40 p-5">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500 text-sm font-bold text-white">
                  {i + 1}
                </div>
                <p className="text-sm font-semibold text-white">{step.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{step.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Problem */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.problemTitle}</h2>
          <p className="mt-2 text-xl font-semibold text-brand-400">{c.problemSubtitle}</p>
        </div>
        <div className="mx-auto mt-8 max-w-xl space-y-3">
          {c.problemScenarios.map((s, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-slate-400">
                {i + 1}
              </span>
              <p className="text-sm text-slate-300">{s}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-base font-medium text-slate-400">
          {c.problemConclusion}
        </p>
      </section>

      {/* Cost */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.costTitle}</h2>
          <p className="mt-2 text-xl font-semibold text-rose-400">{c.costSubtitle}</p>
        </div>
        <div className="mx-auto mt-8 max-w-xl space-y-2">
          {c.costQuestions.map((q, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
              <svg className="flex-shrink-0 text-slate-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              <span>{q}</span>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-xl text-center text-base font-medium text-slate-300">
          {c.costConclusion}
        </p>
        <p className="mx-auto mt-3 max-w-xl text-center text-sm text-slate-500">
          {c.costRisks.map((r, i) => (
            <span key={i}>
              {i > 0 && " · "}
              <span className="text-rose-400">{r}</span>
            </span>
          ))}
        </p>
      </section>

      {/* Solution */}
      <section className="material rounded-3xl border border-brand-500/20 bg-gradient-to-br from-brand-500/5 to-slate-900/40 py-12 sm:py-16">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-400">{c.solutionIntro}</p>
          <h2 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{c.solutionTitle}</h2>
          <div className="mt-6 space-y-2">
            {c.solutionBody.map((b, i) => (
              <p key={i} className="text-base text-slate-300">{b}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {c.solutionGuarantees.map((g, i) => (
              <span key={i} className="rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 text-xs text-emerald-400">
                {g}
              </span>
            ))}
          </div>
          <p className="mt-6 text-lg font-medium text-white">{c.solutionClosing}</p>
        </div>
      </section>

      {/* Different */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.differentTitle}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-slate-400">{c.differentLead}</p>
        <ul className="mx-auto mt-8 max-w-xl space-y-3">
          {c.differentPoints.map((p, i) => (
            <li key={i} className="flex items-start gap-3">
              <svg className="mt-0.5 flex-shrink-0 text-brand-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-slate-300">{p}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Features */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.featuresTitle}</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {c.features.map((f, i) => (
            <div key={i} className="card-pressable rounded-2xl border border-white/5 bg-slate-900/40 p-6 hover:border-white/10 hover:bg-slate-900/70">
              <h3 className="text-lg font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>{f.heading}</h3>
              <div className="mt-2 space-y-2">
                {f.paragraphs.map((p, j) => (
                  <p key={j} className="text-sm leading-relaxed text-slate-400">{p}</p>
                ))}
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-white">{c.nftSection.heading}</h3>
            <div className="mt-2 space-y-2">
              {c.nftSection.paragraphs.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-slate-400">{p}</p>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6">
            <h3 className="text-lg font-semibold text-white">{c.readOnlySection.heading}</h3>
            <div className="mt-2 space-y-2">
              {c.readOnlySection.paragraphs.map((p, j) => (
                <p key={j} className="text-sm leading-relaxed text-slate-400">{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Profiles */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.profilesTitle}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {c.profiles.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/5 bg-slate-900/40 p-5">
              <p className="text-sm font-semibold text-brand-400">{p.name}</p>
              <p className="mt-1 text-sm text-slate-400">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.whyTitle}</h2>
        <p className="mt-3 text-center text-lg font-medium text-slate-300">{c.whyLead}</p>
        <div className="mx-auto mt-8 max-w-md space-y-3">
          {c.whyPoints.map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <svg className="flex-shrink-0 text-emerald-400" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm text-slate-300">{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xl font-bold text-white">{c.whyClosing}</p>
      </section>

      {/* Early CTA */}
      <section className="rounded-3xl border border-white/10 bg-slate-900/40 py-12 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.ctaEarlyTitle}</h2>
        <p className="mt-3 text-lg font-semibold text-brand-400">{c.ctaEarlyClosing}</p>
        <div className="mx-auto mt-6 max-w-md">
          <ul className="grid grid-cols-2 gap-2 text-start">
            {c.ctaEarlyPoints.map((p, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                <svg className="flex-shrink-0 text-brand-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" />
                </svg>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Objections */}
      <section className="py-12 sm:py-16">
        <div className="mx-auto max-w-2xl space-y-6">
          {[c.objectionReadOnly, c.objectionBeginner, c.objectionMultiChain].map((o, i) => (
            <details key={i} className="group rounded-2xl border border-white/5 bg-slate-900/40 p-5">
              <summary className="flex cursor-pointer items-center justify-between text-base font-semibold text-white">
                {o.q}
                <svg className="flex-shrink-0 transition group-open:rotate-180" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{o.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Buy */}
      <section className="py-12 sm:py-16 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.buyTitle}</h2>
        <div className="mx-auto mt-6 max-w-md space-y-2">
          {c.buyPoints.map((p, i) => (
            <p key={i} className="text-base text-slate-300">
              <span className="text-brand-400">+</span> {p}
            </p>
          ))}
        </div>
      </section>

      {/* Risk reversal */}
      <section className="material rounded-3xl border border-emerald-500/20 bg-emerald-500/5 py-12 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.riskTitle}</h2>
        <p className="mx-auto mt-3 max-w-lg text-base text-slate-400">{c.riskLead}</p>
        <div className="mx-auto mt-6 max-w-md space-y-2">
          {c.riskPoints.map((p, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-sm text-slate-300">
              <svg className="text-emerald-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" />
              </svg>
              <span>{p}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-lg font-semibold text-white">{c.riskClosing}</p>
      </section>

      {/* Final + Start */}
      <section className="py-16 text-center">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">{c.finalTitle}</h2>
        <div className="mt-4 space-y-1">
          {c.finalItems.map((p, i) => (
            <p key={i} className="text-lg font-semibold text-brand-400">{p}</p>
          ))}
        </div>
        <p className="mt-6 text-xl font-bold text-white">{c.finalClosing}</p>

        {/* Tier cards */}
        <div className="mx-auto mt-10 max-w-3xl">
          <h3 className="mb-5 text-lg font-semibold text-slate-300">{c.startTitle}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {c.startTiers.map((tier, i) => (
              <div
                key={i}
                className={`card-pressable rounded-2xl border p-5 ${i === 1 ? "border-brand-500/40 bg-gradient-to-br from-brand-500/10 to-slate-900/40" : "border-white/5 bg-slate-900/40"}`}
              >
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-400">{tier.name}</p>
                <p className="mt-1 text-2xl font-extrabold text-white">{tier.price}</p>
                <p className="mt-1 text-xs text-slate-500">{tier.desc}</p>
                <a
                  href="/pricing"
                  className={`pressable mt-4 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${i === 1 ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500" : "border border-white/10 text-slate-200 hover:border-white/20"}`}
                >
                  {tier.cta}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div className="mx-auto mt-10 max-w-lg">
          <ol className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            {c.startSteps.map((s, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span>{s}</span>
                {i < c.startSteps.length - 1 && (
                  <svg className="hidden sm:block text-slate-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Final CTAs */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ConnectButton.Custom>
            {({ openConnectModal, mounted }) => (
              <div {...(!mounted ? { "aria-hidden": true, style: { opacity: 0 } } : {})} className="w-full max-w-xs">
                <button
                  onClick={openConnectModal}
                  className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-500/30 transition hover:from-brand-400 hover:to-brand-500"
                >
                  {c.startCtaPrimary}
                </button>
              </div>
            )}
          </ConnectButton.Custom>
          <a
            href="/pricing"
            className="w-full max-w-xs rounded-xl border border-white/10 bg-slate-900/60 px-6 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:border-white/20 sm:w-auto"
          >
            {c.startCtaSecondary}
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12 sm:py-16">
        <h2 className="text-center text-2xl font-bold text-white sm:text-3xl">{c.faqTitle}</h2>
        <div className="mx-auto mt-8 max-w-2xl space-y-3">
          {c.faq.map((item, i) => (
            <details key={i} className="group rounded-xl border border-white/5 bg-slate-900/40 p-4">
              <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-white">
                {item.q}
                <svg className="flex-shrink-0 transition group-open:rotate-180" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Chain badges */}
      <section className="flex flex-wrap items-center justify-center gap-3 pb-16">
        {supportedChains.map((ch) => {
          const meta = chainMeta[ch.id];
          return (
            <div key={ch.id} className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2">
              <span className="flex h-3 w-3 rounded-full" style={{ backgroundColor: meta.color }} />
              <span className="text-sm font-medium text-slate-200">{meta.name}</span>
            </div>
          );
        })}
      </section>
    </main>
  );
}