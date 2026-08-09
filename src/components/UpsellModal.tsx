"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

interface UpsellModalProps {
  trigger: "max_wallets" | "nft_heavy" | "defi_heavy";
  open: boolean;
  onClose: () => void;
}

const DISMISS_KEY = "vaultfolio:upsell_dismissed";

export function UpsellModal({ trigger, open, onClose }: UpsellModalProps) {
  const { dir } = useI18n();
  const isFr = dir === "ltr";

  useEffect(() => {
    if (open) {
      const key = `${DISMISS_KEY}:${trigger}`;
      const last = localStorage.getItem(key);
      if (last && Date.now() - parseInt(last) < 24 * 60 * 60 * 1000) {
        onClose();
        return;
      }
      localStorage.setItem(key, String(Date.now()));
    }
  }, [open, trigger, onClose]);

  if (!open) return null;

  const content = getUpsellContent(trigger, isFr);

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-spring-in" onClick={onClose} />
      <div className="animate-material-in relative w-full max-w-md rounded-2xl material-thick p-6">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${content.bgColor} ${content.iconColor}`}>
          {content.icon}
        </div>
        <h3 className="text-lg font-bold text-white">{content.title}</h3>
        <p className="mt-2 text-sm text-slate-400">{content.desc}</p>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-brand-500/10 px-3 py-2">
          <span className="rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
            {content.price}
          </span>
          <span className="text-xs text-brand-300">{content.priceLabel}</span>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href="/pricing"
            className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
          >
            {content.cta}
          </a>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
          >
            {content.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}

function getUpsellContent(trigger: string, isFr: boolean) {
  if (trigger === "max_wallets") {
    return isFr
      ? {
          title: "Limite de wallets atteinte",
          desc: "Vous utilisez 3/3 wallets. Passez Whale pour 20 wallets, analytics PnL et white-label.",
          price: "+$20/mo",
          priceLabel: "Whale upgrade",
          cta: "Passer Whale",
          dismiss: "Plus tard",
          bgColor: "bg-brand-500/10",
          iconColor: "text-brand-400",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M2 10h20M6 14h4" />
            </svg>
          ),
        }
      : {
          title: "Wallet limit reached",
          desc: "You're using 3/3 wallets. Upgrade to Whale for 20 wallets, PnL analytics and white-label.",
          price: "+$20/mo",
          priceLabel: "Whale upgrade",
          cta: "Upgrade to Whale",
          dismiss: "Later",
          bgColor: "bg-brand-500/10",
          iconColor: "text-brand-400",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="6" width="20" height="12" rx="2" />
              <path d="M2 10h20M6 14h4" />
            </svg>
          ),
        };
  }

  if (trigger === "nft_heavy") {
    return isFr
      ? {
          title: "Pack NFT Analytics",
          desc: "Floor prices live, PnL par collection, alertes listings/sales. Vos NFTs méritent mieux qu'un simple solde.",
          price: "+$9/mo",
          priceLabel: "NFT Pro Pack",
          cta: "Débloquer NFT Pack",
          dismiss: "Non merci",
          bgColor: "bg-purple-500/10",
          iconColor: "text-purple-400",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          ),
        }
      : {
          title: "NFT Analytics Pack",
          desc: "Live floor prices, per-collection PnL, listing/sale alerts. Your NFTs deserve more than a balance.",
          price: "+$9/mo",
          priceLabel: "NFT Pro Pack",
          cta: "Unlock NFT Pack",
          dismiss: "No thanks",
          bgColor: "bg-purple-500/10",
          iconColor: "text-purple-400",
          icon: (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          ),
        };
  }

  return isFr
    ? {
        title: "DeFi Risk Monitor",
        desc: "Health factor, exposition protocole, alertes liquidation/depeg. Protégez votre portefeuille.",
        price: "+$9/mo",
        priceLabel: "DeFi Safety Pack",
        cta: "Débloquer DeFi Pack",
        dismiss: "Non merci",
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-400",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        ),
      }
    : {
        title: "DeFi Risk Monitor",
        desc: "Health factor, protocol exposure, liquidation/depeg alerts. Protect your portfolio.",
        price: "+$9/mo",
        priceLabel: "DeFi Safety Pack",
        cta: "Unlock DeFi Pack",
        dismiss: "No thanks",
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-400",
        icon: (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2l9 4v6c0 5-4 9-9 10-5-1-9-5-9-10V6l9-4z" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
        ),
      };
}