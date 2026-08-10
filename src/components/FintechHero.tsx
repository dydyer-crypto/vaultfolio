"use client";

import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useI18n } from "@/i18n/I18nProvider";
import { CountUp } from "@/lib/useCountUp";
import { Reveal } from "@/components/Reveal";
import { TokenLogo } from "@/components/TokenLogo";

interface PricePreview {
  symbol: string;
  price: string;
  change: number;
  spark: number[];
  color: string;
  logo: string;
}

const PRICE_FEEDS: PricePreview[] = [
  { symbol: "ETH", price: "$3,247.82", change: 4.2, spark: [60, 58, 62, 55, 68, 64, 72, 78], color: "#627eea", logo: "https://assets.coingecko.com/coins/279/small/ethereum.png" },
  { symbol: "BTC", price: "$67,412.50", change: 2.8, spark: [50, 52, 48, 55, 53, 60, 58, 65], color: "#f7931a", logo: "https://assets.coingecko.com/coins/1/small/bitcoin.png" },
  { symbol: "MATIC", price: "$0.72", change: -1.5, spark: [70, 68, 72, 65, 62, 60, 58, 55], color: "#8247e5", logo: "https://assets.coingecko.com/coins/4713/small/matic-token.png" },
  { symbol: "USDC", price: "$1.00", change: 0.01, spark: [50, 50, 51, 49, 50, 50, 51, 50], color: "#2775ca", logo: "https://assets.coingecko.com/coins/6319/small/usdc.png" },
];

export function FintechHero() {
  const { locale, t } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isFr = locale === "fr";

  const copy = {
    badge: isFr ? "Sécurité · Lecture seule · Multi-chaînes" : "Security · Read-only · Multi-chain",
    title1: isFr ? "Votre portefeuille crypto," : "Your crypto portfolio,",
    title2: isFr ? "sous contrôle total." : "in full control.",
    subtitle: isFr
      ? "Soldes, tokens, NFTs et positions DeFi agrégés sur 19 chaînes. Prix live, alertes en temps réel, export fiscal — sans signer une seule transaction."
      : "Balances, tokens, NFTs and DeFi positions aggregated across 19 chains. Live prices, real-time alerts, tax export — without signing a single transaction.",
    cta: isFr ? "Voir mon portefeuille" : "See my portfolio",
    ctaSecondary: isFr ? "Voir les plans" : "See plans",
    trust1: isFr ? "Aucune seed phrase" : "No seed phrase",
    trust2: isFr ? "Aucune signature" : "No signature required",
    trust3: isFr ? "100% lecture seule" : "100% read-only",
    trust4: isFr ? "Setup en 60s" : "Setup in 60s",
    livePrices: isFr ? "Prix en direct" : "Live prices",
    portfolioValue: isFr ? "Valeur du portefeuille" : "Portfolio value",
    chainsLabel: isFr ? "Chaînes" : "Chains",
    tokensLabel: isFr ? "Tokens" : "Tokens",
    nftsLabel: isFr ? "NFTs" : "NFTs",
    secTitle: isFr ? "Sécurité par conception" : "Security by design",
    secDesc: isFr
      ? "Lecture seule des adresses publiques. Aucun accès aux fonds, aucune seed phrase, aucune approbation."
      : "Read-only access to public addresses. No fund access, no seed phrase, no approvals.",
    sec1: isFr ? "Aucune seed phrase demandée" : "No seed phrase required",
    sec2: isFr ? "Aucune transaction à signer" : "No transactions to sign",
    sec3: isFr ? "Zéro approbation de dépense" : "Zero spending approvals",
    sec4: isFr ? "Adresses publiques uniquement" : "Public addresses only",
    walletTitle: isFr ? "Connectez votre wallet" : "Connect your wallet",
    walletDesc: isFr
      ? "MetaMask, Coinbase, WalletConnect, Rainbow, Rabby — tous compatibles."
      : "MetaMask, Coinbase, WalletConnect, Rainbow, Rabby — all supported.",
    trustTitle: isFr ? "Conçu pour les pros" : "Built for pros",
    trustStat1: isFr ? "19 chaînes" : "19 chains",
    trustStat2: isFr ? "$2.4M trackés" : "$2.4M tracked",
    trustStat3: isFr ? "< 60s setup" : "< 60s setup",
    trustStat4: isFr ? "0 signatures" : "0 signatures",
  };

  return (
    <main className="relative overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="ambient-blob" style={{ width: 400, height: 400, top: -100, left: "20%", background: "#3366ff" }} />
      <div className="ambient-blob" style={{ width: 300, height: 300, top: 200, right: "10%", background: "#8b5cf6", animationDelay: "4s" }} />
      <div className="ambient-blob" style={{ width: 250, height: 250, bottom: 100, left: "30%", background: "#fbbf24", animationDelay: "8s" }} />

      {/* Hero */}
      <section className="relative px-4 pt-16 pb-12 sm:px-6 sm:pt-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Left: copy + CTA */}
            <div className="text-center lg:text-left">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
                <span className="pulse-dot flex h-2 w-2 rounded-full bg-emerald-400" />
                {copy.badge}
              </div>
              <h1 className="display font-extrabold text-white">
                {copy.title1}
                <br />
                <span className="shimmer-text-primary">{copy.title2}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-base text-slate-300 sm:text-lg lg:mx-0">
                {copy.subtitle}
              </p>

              {/* CTA */}
              <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:justify-start">
                <ConnectButton.Custom>
                  {({ openConnectModal, mounted: btnMounted }) => (
                    <div {...(!btnMounted ? { "aria-hidden": true, style: { opacity: 0 } } : {})} className="w-full max-w-xs">
                      <button
                        onClick={openConnectModal}
                        className="pressable accent-glow float-subtle w-full rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
                      >
                        {copy.cta}
                      </button>
                    </div>
                  )}
                </ConnectButton.Custom>
                <a
                  href="/pricing"
                  className="pressable w-full max-w-xs rounded-xl border border-white/10 bg-slate-900/60 px-6 py-3.5 text-center text-sm font-semibold text-slate-200 transition hover:border-white/20 lg:w-auto"
                >
                  {copy.ctaSecondary}
                </a>
              </div>

              {/* Trust bar */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 lg:justify-start">
                {[
                  { label: copy.trust1, icon: "shield" },
                  { label: copy.trust2, icon: "lock" },
                  { label: copy.trust3, icon: "eye" },
                  { label: copy.trust4, icon: "clock" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400">
                    <TrustIcon name={item.icon} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Dashboard preview card (glassmorphism) */}
            <div className="relative">
              {mounted && (
                <div className="animate-material-in card-pressable material-thick rounded-2xl p-5">
                  {/* Dashboard header */}
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-sm font-bold text-brand-400">V</div>
                      <div>
                        <p className="text-xs font-semibold text-white">{t("appName")}</p>
                        <p className="text-[10px] text-slate-500">{copy.livePrices}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="pulse-dot flex h-2 w-2 rounded-full bg-emerald-400" />
                      <span className="text-[10px] text-emerald-400">Live</span>
                    </div>
                  </div>

                  {/* Portfolio value */}
                  <div className="mb-4 rounded-xl border border-white/5 bg-slate-900/50 p-4">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">{copy.portfolioValue}</p>
                    <p className="mt-1 font-mono-data text-2xl font-bold text-white">
                      <span className="shimmer-text"><CountUp end={128492} prefix="$" decimals={0} duration={2000} /></span>
                      <span className="text-base text-slate-500">.37</span>
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400">+4.2%</span>
                      <span className="text-[10px] text-slate-500">24h</span>
                    </div>
                    {/* Mini sparkline */}
                    <Sparkline data={[50, 48, 55, 52, 58, 62, 68, 72, 65, 78, 82]} color="#34d399" height={32} animated />
                  </div>

                  {/* Stats row */}
                  <div className="mb-4 grid grid-cols-3 gap-2">
                    <StatMini label={copy.chainsLabel} value={<CountUp end={19} duration={1000} />} />
                    <StatMini label={copy.tokensLabel} value={<CountUp end={47} duration={1200} delay={200} />} />
                    <StatMini label={copy.nftsLabel} value={<CountUp end={23} duration={1400} delay={400} />} />
                  </div>

                  {/* Price feeds */}
                  <div className="space-y-1.5">
                    {PRICE_FEEDS.map((feed) => (
                      <div key={feed.symbol} className="flex items-center gap-3 rounded-lg border border-white/5 bg-slate-900/40 px-3 py-2">
                        <TokenLogo symbol={feed.symbol} logo={feed.logo} chainColor={feed.color} size={24} />
                        <div className="flex-1">
                          <p className="text-xs font-medium text-white">{feed.symbol}</p>
                        </div>
                        <Sparkline data={feed.spark} color={feed.change >= 0 ? "#34d399" : "#f43f5e"} height={20} width={60} />
                        <div className="text-right">
                          <p className="font-mono-data text-xs font-medium text-white">{feed.price}</p>
                          <p className={`font-mono-data text-[10px] ${feed.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {feed.change >= 0 ? "+" : ""}{feed.change}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Floating security badge */}
              <div className="material-light absolute -bottom-3 -left-3 flex items-center gap-2 rounded-xl border border-emerald-500/20 px-3 py-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-white">Read-only</p>
                  <p className="text-[9px] text-slate-400">0 signatures</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security features highlight */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>{copy.secTitle}</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-slate-400">{copy.secDesc}</p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: copy.sec1, icon: "key", color: "#3366ff" },
              { label: copy.sec2, icon: "signature", color: "#8b5cf6" },
              { label: copy.sec3, icon: "lock", color: "#fbbf24" },
              { label: copy.sec4, icon: "eye", color: "#34d399" },
            ].map((item, i) => (
              <Reveal key={i} animation="spring-up" delay={i * 80}>
                <div className="card-pressable lift-on-hover material-light rounded-2xl border border-white/5 p-5 text-center">
                <div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${item.color}15`, color: item.color }}
                >
                  <SecurityIcon name={item.icon} />
                </div>
                <p className="text-sm font-medium text-slate-200">{item.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet integration showcase */}
      <section className="relative px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>{copy.walletTitle}</h2>
          <p className="mt-3 text-sm text-slate-400">{copy.walletDesc}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {[
              { name: "MetaMask", color: "#f6851b" },
              { name: "Coinbase", color: "#0052ff" },
              { name: "WalletConnect", color: "#3b99fc" },
              { name: "Rainbow", color: "#a64ef4" },
              { name: "Rabby", color: "#ff7a45" },
            ].map((w, i) => (
              <Reveal key={w.name} animation="spring-in" delay={i * 60}>
                <div
                  className="card-pressable lift-on-hover material-light flex items-center gap-2 rounded-xl border border-white/5 px-4 py-2.5"
                >
                <span className="flex h-6 w-6 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: w.color }}>
                  {w.name.charAt(0)}
                </span>
                <span className="text-sm font-medium text-slate-200">{w.name}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="material relative border-y border-white/5 px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-center text-sm font-semibold text-slate-400 uppercase tracking-wider">{copy.trustTitle}</p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: 19, label: copy.chainsLabel, suffix: "" },
              { value: 2.4, label: isFr ? "Trackés" : "Tracked", prefix: "$", suffix: "M" },
              { value: 60, label: "Setup", prefix: "<", suffix: "s" },
              { value: 0, label: isFr ? "Signatures" : "Signatures", suffix: "" },
            ].map((stat, i) => (
              <Reveal key={i} animation="spring-up" delay={i * 100}>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-white sm:text-3xl" style={{ letterSpacing: "-0.02em" }}>
                    <CountUp end={stat.value} prefix={stat.prefix || ""} suffix={stat.suffix || ""} decimals={stat.value % 1 !== 0 ? 1 : 0} duration={1500} delay={i * 100} />
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{stat.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function Sparkline({ data, color, height = 24, width = 80, animated = false }: { data: number[]; color: string; height?: number; width?: number; animated?: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height} className="flex-shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        className={animated ? "chart-line-animated" : ""}
      />
    </svg>
  );
}

function StatMini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-white/5 bg-slate-900/40 p-2 text-center">
      <p className="font-mono-data text-sm font-bold text-white">{value}</p>
      <p className="text-[9px] text-slate-400">{label}</p>
    </div>
  );
}

function TrustIcon({ name }: { name: string }) {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  switch (name) {
    case "shield":
      return <svg {...props}><path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" /></svg>;
    case "lock":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
    case "eye":
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "clock":
      return <svg {...props}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>;
    default:
      return null;
  }
}

function SecurityIcon({ name }: { name: string }) {
  const props = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2 };
  switch (name) {
    case "key":
      return <svg {...props}><path d="M21 2l-2 2m-7.5 7.5a5 5 0 11-7 7 5 5 0 017-7zm0 0l3-3m0 0l3-3m-3 3l3-3" /></svg>;
    case "signature":
      return <svg {...props}><path d="M3 17l6-6 4 4 4-4 4 4M3 21h18" /></svg>;
    case "lock":
      return <svg {...props}><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>;
    case "eye":
      return <svg {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>;
    default:
      return null;
  }
}