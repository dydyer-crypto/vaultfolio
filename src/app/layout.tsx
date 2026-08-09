import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";

const SITE_URL = "https://vaultfolio.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vaultfolio — Multi-chain Web3 Portfolio Dashboard",
    template: "%s · Vaultfolio",
  },
  description:
    "Track native assets, ERC-20 tokens, NFTs and DeFi positions across 19 chains (Ethereum, Polygon, Base, Arbitrum, Optimism, Avalanche & more). Real-time prices, read-only, zero signatures, zero risk.",
  keywords: [
    "web3 portfolio",
    "crypto portfolio tracker",
    "multi-chain dashboard",
    "ethereum portfolio",
    "polygon portfolio",
    "base portfolio",
    "erc20 tracker",
    "nft portfolio",
    "defi positions",
    "wallet tracker",
    "crypto net worth",
    "blockchain portfolio",
  ],
  authors: [{ name: "Vaultfolio" }],
  creator: "Vaultfolio",
  alternates: {
    canonical: SITE_URL,
    languages: { en: SITE_URL, fr: `${SITE_URL}?lang=fr`, ar: `${SITE_URL}?lang=ar` },
  },
  openGraph: {
    title: "Vaultfolio — Multi-chain Web3 Portfolio Dashboard",
    description: "Track tokens, NFTs and DeFi across 19 chains in one read-only dashboard. No signatures, no risk.",
    url: SITE_URL,
    siteName: "Vaultfolio",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaultfolio — Multi-chain Web3 Portfolio Dashboard",
    description: "Track tokens, NFTs and DeFi across 19 chains in one read-only dashboard.",
    creator: "@vaultfolio",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}