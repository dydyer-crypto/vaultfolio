export type Locale = "en" | "fr" | "ar";

export const locales: Locale[] = ["en", "fr", "ar"];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const localeDir: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};

export type MessageKey =
  | "appName"
  | "tagline"
  | "connectWallet"
  | "wrongNetwork"
  | "walletConnected"
  | "disconnect"
  | "totalValue"
  | "assets"
  | "nfts"
  | "chains"
  | "token"
  | "balance"
  | "price"
  | "value"
  | "chain"
  | "noTokens"
  | "noNfts"
  | "loadingTokens"
  | "loadingNfts"
  | "refresh"
  | "refreshing"
  | "address"
  | "copyAddress"
  | "copied"
  | "viewOnExplorer"
  | "language"
  | "heroTitle"
  | "heroSubtitle"
  | "heroCta"
  | "featuresTitle"
  | "feature1Title"
  | "feature1Desc"
  | "feature2Title"
  | "feature2Desc"
  | "feature3Title"
  | "feature3Desc"
  | "feature4Title"
  | "feature4Desc"
  | "footerText"
  | "notConnected"
  | "notConnectedDesc"
  | "portfolioOverview"
  | "netWorth"
  | "tokens"
  | "collectibles"
  | "networks"
  | "pricingTitle"
  | "pricingSubtitle"
  | "month"
  | "year"
  | "perMonth"
  | "perYear"
  | "choosePlan"
  | "currentPlan"
  | "upgrade"
  | "cancelSubscription"
  | "mostPopular"
  | "free"
  | "starter"
  | "pro"
  | "whale"
  | "features"
  | "upgradeCta"
  | "upgradeToUnlock"
  | "upgradeDesc"
  | "premiumFeature"
  | "premiumChain"
  | "premiumWallets"
  | "premiumDeFi"
  | "premiumAlerts"
  | "premiumExport"
  | "premiumHistory"
  | "premiumAnalytics"
  | "premiumPriority"
  | "premiumWhiteLabel"
  | "planFree"
  | "planPro"
  | "planWhale"
  | "billingMonthly"
  | "billingYearly"
  | "saveYearly"
  | "subscribed"
  | "subActive"
  | "subCancelAt"
  | "managing"
  | "backToDashboard"
  | "managePlan";

type Messages = Record<MessageKey, string>;

const en: Messages = {
  appName: "Vaultfolio",
  tagline: "Your multi-chain Web3 portfolio, unified.",
  connectWallet: "Connect Wallet",
  wrongNetwork: "Wrong network",
  walletConnected: "Connected",
  disconnect: "Disconnect",
  totalValue: "Total Portfolio Value",
  assets: "Assets",
  nfts: "NFTs",
  chains: "Chains",
  token: "Token",
  balance: "Balance",
  price: "Price",
  value: "Value",
  chain: "Chain",
  noTokens: "No tokens found on this chain.",
  noNfts: "No NFTs found on this chain.",
  loadingTokens: "Loading token balances…",
  loadingNfts: "Loading NFTs…",
  refresh: "Refresh",
  refreshing: "Refreshing…",
  address: "Address",
  copyAddress: "Copy address",
  copied: "Copied!",
  viewOnExplorer: "View on explorer",
  language: "Language",
  heroTitle: "See everything in your wallet — in one dashboard",
  heroSubtitle:
    "Track native assets, ERC-20 tokens and NFTs across Ethereum, Polygon and Base. Real-time prices, clean UI, zero jargon.",
  heroCta: "Connect your wallet to start",
  featuresTitle: "Everything you need to track your on-chain wealth",
  feature1Title: "Multi-chain balances",
  feature1Desc:
    "Native ETH, MATIC and ETH on Base, plus every ERC-20 token — aggregated automatically.",
  feature2Title: "Live price feeds",
  feature2Desc:
    "Token values powered by CoinGecko, refreshed on demand so you always know your net worth.",
  feature3Title: "NFT collectibles",
  feature3Desc:
    "Browse your ERC-721 and ERC-1155 collectibles with metadata, images and collection info.",
  feature4Title: "Privacy-first",
  feature4Desc:
    "Read-only smart contract calls. We never touch your funds or ask for approvals.",
  footerText: "Built with Next.js, Wagmi, Viem & RainbowKit. Read-only — no transactions signed.",
  notConnected: "Connect your wallet to view your portfolio",
  notConnectedDesc:
    "Vaultfolio reads on-chain balances only. No signatures, no approvals, no risk.",
  portfolioOverview: "Portfolio Overview",
  netWorth: "Net Worth",
  tokens: "Tokens",
  collectibles: "Collectibles",
  networks: "Networks",
  pricingTitle: "Simple, transparent pricing",
  pricingSubtitle: "Start free. Upgrade when you need more chains, wallets and DeFi tracking.",
  month: "month",
  year: "year",
  perMonth: "/mo",
  perYear: "/yr",
  choosePlan: "Choose plan",
  currentPlan: "Current plan",
  upgrade: "Upgrade",
  cancelSubscription: "Cancel subscription",
  mostPopular: "Most popular",
  free: "Free",
  starter: "Starter",
  pro: "Pro",
  whale: "Whale",
  features: "Features",
  upgradeCta: "Upgrade now",
  upgradeToUnlock: "Upgrade to unlock",
  upgradeDesc: "Unlock more chains, wallets, DeFi tracking and alerts.",
  premiumFeature: "Premium feature",
  premiumChain: "More chains (Base, Arbitrum, Optimism, Avalanche)",
  premiumWallets: "Multi-wallet tracking",
  premiumDeFi: "DeFi positions (Uniswap, Aave, Compound)",
  premiumAlerts: "Price alerts (email + Telegram)",
  premiumExport: "CSV / JSON export",
  premiumHistory: "24h portfolio history",
  premiumAnalytics: "Portfolio analytics + PnL",
  premiumPriority: "Priority RPC routing",
  premiumWhiteLabel: "White-label dashboard URL",
  planFree: "Free forever",
  planPro: "Pro plan",
  planWhale: "Whale plan",
  billingMonthly: "Monthly billing",
  billingYearly: "Yearly billing",
  saveYearly: "Save 27%",
  subscribed: "You're subscribed",
  subActive: "Active",
  subCancelAt: "Cancels at period end",
  managing: "Managing plan",
  backToDashboard: "Back to dashboard",
  managePlan: "Manage plan",
};

const fr: Messages = {
  appName: "Vaultfolio",
  tagline: "Votre portefeuille Web3 multi-chaînes, unifié.",
  connectWallet: "Connecter le portefeuille",
  wrongNetwork: "Mauvais réseau",
  walletConnected: "Connecté",
  disconnect: "Déconnecter",
  totalValue: "Valeur totale du portefeuille",
  assets: "Actifs",
  nfts: "NFTs",
  chains: "Chaînes",
  token: "Jeton",
  balance: "Solde",
  price: "Prix",
  value: "Valeur",
  chain: "Chaîne",
  noTokens: "Aucun jeton trouvé sur cette chaîne.",
  noNfts: "Aucun NFT trouvé sur cette chaîne.",
  loadingTokens: "Chargement des soldes…",
  loadingNfts: "Chargement des NFTs…",
  refresh: "Actualiser",
  refreshing: "Actualisation…",
  address: "Adresse",
  copyAddress: "Copier l'adresse",
  copied: "Copié !",
  viewOnExplorer: "Voir sur l'explorateur",
  language: "Langue",
  heroTitle: "Visualisez tout votre portefeuille — sur un seul tableau de bord",
  heroSubtitle:
    "Suivez les actifs natifs, les jetons ERC-20 et les NFTs sur Ethereum, Polygon et Base. Prix en temps réel, interface claire, sans jargon.",
  heroCta: "Connectez votre portefeuille pour commencer",
  featuresTitle: "Tout pour suivre votre patrimoine on-chain",
  feature1Title: "Soldes multi-chaînes",
  feature1Desc:
    "ETH natif, MATIC et ETH sur Base, plus tous les jetons ERC-20 — agrégés automatiquement.",
  feature2Title: "Prix en direct",
  feature2Desc:
    "Valeurs des jetons via CoinGecko, actualisées à la demande pour toujours connaître votre patrimoine.",
  feature3Title: "NFTs et collectibles",
  feature3Desc:
    "Parcourez vos collectibles ERC-721 et ERC-1155 avec métadonnées, images et infos de collection.",
  feature4Title: "Confidentialité d'abord",
  feature4Desc:
    "Appels en lecture seule aux contrats. Nous ne touchons jamais vos fonds ni demandons d'approbations.",
  footerText:
    "Construit avec Next.js, Wagmi, Viem et RainbowKit. Lecture seule — aucune transaction signée.",
  notConnected: "Connectez votre portefeuille pour voir votre portefeuille",
  notConnectedDesc:
    "Vaultfolio lit uniquement les soldes on-chain. Aucune signature, aucune approbation, aucun risque.",
  portfolioOverview: "Aperçu du portefeuille",
  netWorth: "Patrimoine net",
  tokens: "Jetons",
  collectibles: "Collectibles",
  networks: "Réseaux",
  pricingTitle: "Tarifs simples et transparents",
  pricingSubtitle: "Commencez gratuitement. Passez à un forfait supérieur pour plus de chaînes, de wallets et de suivi DeFi.",
  month: "mois",
  year: "an",
  perMonth: "/mois",
  perYear: "/an",
  choosePlan: "Choisir ce forfait",
  currentPlan: "Forfait actuel",
  upgrade: "Améliorer",
  cancelSubscription: "Annuler l'abonnement",
  mostPopular: "Le plus populaire",
  free: "Gratuit",
  starter: "Starter",
  pro: "Pro",
  whale: "Whale",
  features: "Fonctionnalités",
  upgradeCta: "Améliorer maintenant",
  upgradeToUnlock: "Améliorez pour débloquer",
  upgradeDesc: "Débloquez plus de chaînes, de wallets, le suivi DeFi et les alertes.",
  premiumFeature: "Fonctionnalité premium",
  premiumChain: "Plus de chaînes (Base, Arbitrum, Optimism, Avalanche)",
  premiumWallets: "Suivi multi-wallets",
  premiumDeFi: "Positions DeFi (Uniswap, Aave, Compound)",
  premiumAlerts: "Alertes de prix (email + Telegram)",
  premiumExport: "Export CSV / JSON",
  premiumHistory: "Historique 24h du portefeuille",
  premiumAnalytics: "Analytique de portefeuille + PnL",
  premiumPriority: "Routage RPC prioritaire",
  premiumWhiteLabel: "URL de tableau de bord white-label",
  planFree: "Gratuit pour toujours",
  planPro: "Forfait Pro",
  planWhale: "Forfait Whale",
  billingMonthly: "Facturation mensuelle",
  billingYearly: "Facturation annuelle",
  saveYearly: "Économisez 27%",
  subscribed: "Vous êtes abonné",
  subActive: "Actif",
  subCancelAt: "Annulation en fin de période",
  managing: "Gestion du forfait",
  backToDashboard: "Retour au tableau de bord",
  managePlan: "Gérer le forfait",
};

const ar: Messages = {
  appName: "Vaultfolio",
  tagline: "محفظتك متعددة السلاسل، موحّدة في مكان واحد.",
  connectWallet: "ربط المحفظة",
  wrongNetwork: "شبكة خاطئة",
  walletConnected: "متصل",
  disconnect: "قطع الاتصال",
  totalValue: "القيمة الإجمالية للمحفظة",
  assets: "الأصول",
  nfts: "NFTs",
  chains: "السلاسل",
  token: "الرمز",
  balance: "الرصيد",
  price: "السعر",
  value: "القيمة",
  chain: "الشبكة",
  noTokens: "لا توجد رموز على هذه السلسلة.",
  noNfts: "لا توجد NFTs على هذه السلسلة.",
  loadingTokens: "جارٍ تحميل الأرصدة…",
  loadingNfts: "جارٍ تحميل NFTs…",
  refresh: "تحديث",
  refreshing: "جارٍ التحديث…",
  address: "العنوان",
  copyAddress: "نسخ العنوان",
  copied: "تم النسخ!",
  viewOnExplorer: "عرض في المستكشف",
  language: "اللغة",
  heroTitle: "شاهد كل شيء في محفظتك — في لوحة واحدة",
  heroSubtitle:
    "تتبّع الأصول الأصلية ورموز ERC-20 و NFTs على Ethereum و Polygon و Base. أسعار حية وواجهة واضحة بلا مصطلحات معقدة.",
  heroCta: "اربط محفظتك للبدء",
  featuresTitle: "كل ما تحتاجه لتتبّع ثروتك على السلسلة",
  feature1Title: "أرصدة متعددة السلاسل",
  feature1Desc:
    "ETH الأصلي و MATIC و ETH على Base، بالإضافة إلى كل رمز ERC-20 — مجمّعة تلقائياً.",
  feature2Title: "أسعار حية",
  feature2Desc:
    "قيم الرموز عبر CoinGecko، محدّثة عند الطلب لمعرفة صافي ثروتك دائماً.",
  feature3Title: "مقتنيات NFT",
  feature3Desc:
    "تصفّح مقتنياتك ERC-721 و ERC-1155 مع البيانات الوصفية والصور ومعلومات المجموعة.",
  feature4Title: "الخصوصية أولاً",
  feature4Desc:
    "استدعاءات قراءة فقط للعقود الذكية. لا نلمس أموالك ولا نطلب موافقات.",
  footerText: "مبني بـ Next.js و Wagmi و Viem و RainbowKit. قراءة فقط — لا توجد معاملات موقّعة.",
  notConnected: "اربط محفظتك لعرض محفظتك",
  notConnectedDesc:
    "Vaultfolio يقرأ الأرصدة على السلسلة فقط. لا توقيعات ولا موافقات ولا مخاطر.",
  portfolioOverview: "نظرة عامة على المحفظة",
  netWorth: "صافي الثروة",
  tokens: "الرموز",
  collectibles: "المقتنيات",
  networks: "الشبكات",
  pricingTitle: "أسعار بسيطة وشفافة",
  pricingSubtitle: "ابدأ مجاناً. قم بالترقية عندما تحتاج المزيد من السلاسل والمحافظ وتتبع DeFi.",
  month: "شهر",
  year: "سنة",
  perMonth: "/شهر",
  perYear: "/سنة",
  choosePlan: "اختر الخطة",
  currentPlan: "الخطة الحالية",
  upgrade: "ترقية",
  cancelSubscription: "إلغاء الاشتراك",
  mostPopular: "الأكثر شيوعاً",
  free: "مجاني",
  starter: "Starter",
  pro: "Pro",
  whale: "Whale",
  features: "الميزات",
  upgradeCta: "الترقية الآن",
  upgradeToUnlock: "قم بالترقية للفتح",
  upgradeDesc: "افتح المزيد من السلاسل والمحافظ وتتبع DeFi والتنبيهات.",
  premiumFeature: "ميزة مدفوعة",
  premiumChain: "مزيد من السلاسل (Base، Arbitrum، Optimism، Avalanche)",
  premiumWallets: "تتبع محافظ متعددة",
  premiumDeFi: "مراكز DeFi (Uniswap، Aave، Compound)",
  premiumAlerts: "تنبيهات الأسعار (بريد + Telegram)",
  premiumExport: "تصدير CSV / JSON",
  premiumHistory: "سجل المحفظة 24 ساعة",
  premiumAnalytics: "تحليلات المحفظة + PnL",
  premiumPriority: "توجيه RPC ذو أولوية",
  premiumWhiteLabel: "رابط لوحة تحكم white-label",
  planFree: "مجاني للأبد",
  planPro: "خطة Pro",
  planWhale: "خطة Whale",
  billingMonthly: "فوترة شهرية",
  billingYearly: "فوترة سنوية",
  saveYearly: "وفّر 27%",
  subscribed: "أنت مشترك",
  subActive: "نشط",
  subCancelAt: "إلغاء في نهاية الفترة",
  managing: "إدارة الخطة",
  backToDashboard: "العودة للوحة التحكم",
  managePlan: "إدارة الخطة",
};

export const messages: Record<Locale, Messages> = { en, fr, ar };

export function getMessage(locale: Locale, key: MessageKey): string {
  return messages[locale]?.[key] ?? messages.en[key];
}