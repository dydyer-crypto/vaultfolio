"use client";

import Image from "next/image";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useI18n } from "@/i18n/I18nProvider";
import { locales, localeNames, type Locale } from "@/i18n/config";
import { useBrand } from "@/lib/useBrand";

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const brand = useBrand();
  const displayName = brand?.name ?? t("appName");
  const displayTagline = brand?.tagline ?? t("tagline");
  const brandColor = brand?.color;

  return (
    <header className="header-edge material sticky top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          {brand?.logoUrl ? (
            <Image
              src={brand.logoUrl}
              alt={displayName}
              width={36}
              height={36}
              className="h-9 w-9 rounded-xl"
              unoptimized
            />
          ) : (
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold text-white shadow-lg"
              style={
                brandColor
                  ? { backgroundColor: brandColor, boxShadow: `0 4px 14px ${brandColor}40` }
                  : { background: "linear-gradient(to bottom right, #3366ff, #1a31ad)", boxShadow: "0 4px 14px rgba(51,102,255,0.3)" }
              }
            >
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="leading-tight">
            <p className="text-sm font-semibold text-white" style={{ letterSpacing: "-0.01em" }}>{displayName}</p>
            <p className="hidden text-xs text-slate-400 sm:block">{displayTagline}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              aria-label={t("language")}
              value={locale}
              onChange={(e) => setLocale(e.target.value as Locale)}
              className="pressable cursor-pointer rounded-lg border border-white/10 bg-slate-900/60 px-2 py-1.5 text-xs text-slate-200 outline-none transition hover:border-white/20 focus:border-brand-500"
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {localeNames[l]}
                </option>
              ))}
            </select>
          </div>
          <ConnectButton showBalance={false} chainStatus="icon" />
        </div>
      </div>
    </header>
  );
}