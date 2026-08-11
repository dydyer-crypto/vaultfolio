import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "./providers";
import { VoiceWidget } from "@/components/VoiceWidget";

  const SITE_URL = "https://vaultfolio.pro";

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
    languages: {
      en: SITE_URL,
      fr: `${SITE_URL}?lang=fr`,
      ar: `${SITE_URL}?lang=ar`,
      "x-default": SITE_URL,
    },
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
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vaultfolio",
    url: SITE_URL,
    logo: `${SITE_URL}/icon.svg`,
    description: "Multi-chain Web3 portfolio dashboard for European investors. Track native assets, ERC-20 tokens, NFTs and DeFi positions across 19 chains.",
    sameAs: ["https://twitter.com/vaultfolio"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@vaultfolio.app",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Can Vaultfolio move my funds?",
        acceptedAnswer: { "@type": "Answer", text: "No. Vaultfolio is read-only. It reads on-chain data from your wallets without spending authorization." },
      },
      {
        "@type": "Question",
        name: "Which chains are supported?",
        acceptedAnswer: { "@type": "Answer", text: "Starter includes Ethereum + Polygon. Pro adds Base, Arbitrum, Optimism, Avalanche. Whale extends to 20+ chains." },
      },
      {
        "@type": "Question",
        name: "Can I track multiple wallets?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Free: 1 wallet. Pro: 3 wallets. Whale: 20 wallets." },
      },
      {
        "@type": "Question",
        name: "Are NFTs visible?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. ERC-721 / ERC-1155 NFTs are displayed with visuals and explorer links." },
      },
      {
        "@type": "Question",
        name: "Where do prices come from?",
        acceptedAnswer: { "@type": "Answer", text: "Live prices are provided via CoinGecko." },
      },
      {
        "@type": "Question",
        name: "Who is Vaultfolio for?",
        acceptedAnswer: { "@type": "Answer", text: "Retail crypto investors, traders, DeFi users, NFT collectors, DAOs, treasury managers and crypto wealth managers." },
      },
      {
        "@type": "Question",
        name: "How does payment work?",
        acceptedAnswer: { "@type": "Answer", text: "Subscriptions are managed via Stripe Checkout, monthly or yearly." },
      },
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vaultfolio",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Explicit hreflang links for multilingual SEO */}
        <link rel="alternate" hrefLang="en" href={SITE_URL} />
        <link rel="alternate" hrefLang="fr" href={`${SITE_URL}?lang=fr`} />
        <link rel="alternate" hrefLang="ar" href={`${SITE_URL}?lang=ar`} />
        <link rel="alternate" hrefLang="x-default" href={SITE_URL} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <VoiceWidget />
      </body>
    </html>
  );
}