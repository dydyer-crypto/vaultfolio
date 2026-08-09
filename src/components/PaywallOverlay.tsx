"use client";

import { useI18n } from "@/i18n/I18nProvider";

interface PaywallOverlayProps {
  open: boolean;
  onClose: () => void;
  featureLabel: string;
}

export function PaywallOverlay({ open, onClose, featureLabel }: PaywallOverlayProps) {
  const { t, dir } = useI18n();
  if (!open) return null;

  return (
    <div dir={dir} className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-spring-in"
        onClick={onClose}
      />
      <div className="animate-material-in relative w-full max-w-md rounded-2xl material-thick p-6">
        <button
          onClick={onClose}
          className="pressable absolute right-4 top-4 text-slate-400 transition hover:text-white"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-white" style={{ letterSpacing: "-0.015em" }}>{t("upgradeToUnlock")}</h3>
        <p className="mt-1 text-sm text-slate-400">{featureLabel}</p>
        <p className="mt-3 text-sm text-slate-300">{t("upgradeDesc")}</p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href="/pricing"
            className="pressable flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
          >
            {t("upgradeCta")}
          </a>
          <button
            onClick={onClose}
            className="pressable flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:border-white/20"
          >
            {t("backToDashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}