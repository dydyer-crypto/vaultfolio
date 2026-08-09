"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="border-t border-white/5 px-4 py-6 text-center sm:px-6">
      <p className="text-xs text-slate-500">{t("footerText")}</p>
    </footer>
  );
}

export function CopyAddressButton({ address }: { address: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 transition hover:border-white/20 hover:text-white"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
      </svg>
      {copied ? t("copied") : t("copyAddress")}
    </button>
  );
}