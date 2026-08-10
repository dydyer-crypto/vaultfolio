"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function ExitIntentPopup() {
  const { t, dir } = useI18n();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const DISMISS_KEY = "vaultfolio:exit_shown";
    if (localStorage.getItem(DISMISS_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !shown) {
        setOpen(true);
        setShown(true);
        localStorage.setItem(DISMISS_KEY, "1");
      }
    };

    const handleMobileBack = () => {
      if (!shown && document.documentElement.scrollTop > 200) {
        setOpen(true);
        setShown(true);
        localStorage.setItem(DISMISS_KEY, "1");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("pagehide", handleMobileBack);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("pagehide", handleMobileBack);
    };
  }, [shown]);

  if (!open) return null;

  const isFr = t("appName") === "Vaultfolio" && dir === "ltr";
  const title = isFr ? "Avant de partir…" : "Wait before you leave…";
  const desc = isFr
    ? "Passez Pro aujourd'hui et économisez 27% sur l'année. Offre de lancement limitée."
    : "Go Pro today and save 27% yearly. Limited launch offer.";
  const cta = isFr ? "Profiter de l'offre" : "Claim the offer";
  const noThanks = isFr ? "Non merci" : "No thanks";

  return (
    <div dir={dir} className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-spring-in" onClick={() => setOpen(false)} />
      <div className="animate-material-in relative w-full max-w-md rounded-2xl material-thick p-6">
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-slate-400 transition hover:text-white"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-2 text-sm text-slate-400">{desc}</p>
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2">
          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white">
            -27%
          </span>
          <span className="text-xs text-emerald-400">Pro Yearly · $79/an</span>
        </div>
        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <a
            href="/pricing"
            className="flex-1 rounded-xl bg-gradient-to-r from-brand-500 to-brand-600 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:from-brand-400 hover:to-brand-500"
          >
            {cta}
          </a>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
          >
            {noThanks}
          </button>
        </div>
      </div>
    </div>
  );
}