"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  getMessage,
  localeDir,
  locales,
  type Locale,
  type MessageKey,
} from "./config";

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  dir: "ltr" | "rtl";
  t: (key: MessageKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);
const STORAGE_KEY = "vaultfolio:locale";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved && locales.includes(saved as Locale)) {
      setLocaleState(saved as Locale);
      return;
    }
    const nav = typeof navigator !== "undefined" ? navigator.language.slice(0, 2) : "en";
    if (locales.includes(nav as Locale)) {
      setLocaleState(nav as Locale);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, l);
    }
  }, []);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      dir: localeDir[locale],
      t: (key: MessageKey) => getMessage(locale, key),
    }),
    [locale, setLocale]
  );

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = localeDir[locale];
    }
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}