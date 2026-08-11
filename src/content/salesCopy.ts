export type Locale = "en" | "fr" | "ar";

export interface SalesSection {
  heading: string;
  paragraphs: string[];
}

export interface SalesCopy {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroLead: string;
  heroCta: string;
  heroCtaSecondary: string;
  trustBar: string[];

  socialProof: {
    stat1Value: string;
    stat1Label: string;
    stat2Value: string;
    stat2Label: string;
    stat3Value: string;
    stat3Label: string;
    banner: string;
  };

  howItWorksTitle: string;
  howItWorksSteps: { title: string; desc: string }[];

  problemTitle: string;
  problemSubtitle: string;
  problemScenarios: string[];
  problemConclusion: string;

  costTitle: string;
  costSubtitle: string;
  costQuestions: string[];
  costConclusion: string;
  costRisks: string[];

  solutionIntro: string;
  solutionTitle: string;
  solutionBody: string[];
  solutionGuarantees: string[];
  solutionClosing: string;

  differentTitle: string;
  differentLead: string;
  differentPoints: string[];

  featuresTitle: string;
  features: SalesSection[];
  nftSection: SalesSection;
  readOnlySection: SalesSection;
  profilesTitle: string;
  profiles: { name: string; desc: string }[];

  whyTitle: string;
  whyLead: string;
  whyPoints: string[];
  whyClosing: string;

  ctaEarlyTitle: string;
  ctaEarlyClosing: string;
  ctaEarlyPoints: string[];

  objectionReadOnly: { q: string; a: string };
  objectionBeginner: { q: string; a: string };
  objectionMultiChain: { q: string; a: string };

  buyTitle: string;
  buyPoints: string[];

  riskTitle: string;
  riskLead: string;
  riskPoints: string[];
  riskClosing: string;

  finalTitle: string;
  finalItems: string[];
  finalClosing: string;

  startTitle: string;
  startTiers: { name: string; price: string; desc: string; cta: string }[];
  startSteps: string[];
  startCtaPrimary: string;
  startCtaSecondary: string;

  faqTitle: string;
  faq: { q: string; a: string }[];

  // Pricing page
  pricingBadge: string;
  tierNameFree: string;
  tierNamePro: string;
  tierNameWhale: string;
  tierDescFree: string;
  tierDescPro: string;
  tierDescWhale: string;
  included: string;
  idealFor: string;
}

const fr: SalesCopy = {
  heroBadge: "100% Lecture seule · Aucune signature · Setup en 1 min",
  heroTitle:
    "Suivez tout votre portefeuille Web3 en un seul endroit",
  heroSubtitle:
    "Tokens, NFTs et positions multi-chaînes réunis dans un dashboard clair, rapide et 100% lecture seule.",
  heroLead:
    "Ajoutez une adresse wallet gratuitement et obtenez en quelques secondes une vue consolidée de vos actifs sur Ethereum, Polygon et Base.",
  heroCta: "Voir mon portefeuille gratuitement",
  heroCtaSecondary: "Voir comment ça marche",
  trustBar: [
    "Aucune seed phrase",
    "Aucune transaction à signer",
    "100% lecture seule",
    "Configuration en moins d'1 minute",
  ],

  socialProof: {
    stat1Value: "19",
    stat1Label: "chaînes supportées",
    stat2Value: "$2.4M",
    stat2Label: "valeur trackée par les utilisateurs",
    stat3Value: "< 60s",
    stat3Label: "pour voir votre portefeuille",
    banner: "Déjà utilisé par des investisseurs crypto sur Ethereum, Polygon, Base et 16 autres chaînes",
  },

  howItWorksTitle: "Comment ça marche",
  howItWorksSteps: [
    {
      title: "Ajoutez une adresse wallet",
      desc: "Collez une adresse publique ou connectez votre wallet. Aucune signature requise.",
    },
    {
      title: "Vaultfolio agrège vos actifs",
      desc: "Nous lisons en lecture seule vos soldes, tokens ERC-20, NFTs et prix live via CoinGecko.",
    },
    {
      title: "Consultez votre portefeuille consolidé",
      desc: "Vue unifiée par chaîne, wallet, token et NFT — triée par valeur USD décroissante.",
    },
  ],

  problemTitle: "Vous n'avez pas un problème de portefeuille.",
  problemSubtitle: "Vous avez un problème de visibilité.",
  problemScenarios: [
    "Vous ouvrez Etherscan pour vérifier un solde.",
    "Puis Polygonscan pour voir un token.",
    "Puis Basescan pour retrouver un NFT.",
    "Puis CoinGecko pour confirmer le prix.",
  ],
  problemConclusion:
    "Et au final, vous avez des données… mais aucune vision d'ensemble.",

  costTitle: "Le vrai coût, ce n'est pas le temps perdu.",
  costSubtitle:
    "C'est les décisions prises à l'aveugle.",
  costQuestions: [
    "Combien vaut réellement mon portefeuille aujourd'hui ?",
    "Quels assets performent ou chutent sur 24h ?",
    "Où sont mes tokens les plus exposés ?",
    "Quelle part de mon patrimoine est immobilisée en DeFi ?",
    "Quels wallets ou collections NFT méritent mon attention ?",
  ],
  costConclusion: "Sans vue consolidée, vous subissez au lieu de piloter.",
  costRisks: [
    "rater une opportunité",
    "oublier des actifs",
    "sous-estimer votre exposition",
    "perdre du temps à reconstruire manuellement votre situation",
  ],

  solutionIntro: "C'est précisément pour ça que Vaultfolio existe.",
  solutionTitle:
    "Un dashboard de portefeuille Web3 multi-chaînes qui agrège vos actifs on-chain dans une interface simple, rapide et lisible.",
  solutionBody: [
    "Vous entrez un wallet.",
    "Vaultfolio lit les données en lecture seule.",
    "Et vous obtenez instantanément une vue unifiée de vos avoirs.",
  ],
  solutionGuarantees: [
    "Pas de bridge à connecter.",
    "Pas de permission risquée.",
    "Pas besoin de naviguer entre plusieurs explorateurs.",
  ],
  solutionClosing: "Juste une vision claire, exploitable et centralisée de votre patrimoine crypto.",

  differentTitle: "Ce qui rend Vaultfolio différent",
  differentLead:
    "Beaucoup d'outils Web3 sont puissants… mais compliqués. Vaultfolio prend l'approche inverse : onboarding wallet-first, lecture seule, interface claire, freemium sans friction.",
  differentPoints: [
    "vous commencez gratuitement",
    "vous testez la valeur immédiatement",
    "vous visualisez vos actifs sans prendre de risque",
    "puis vous débloquez plus de chaînes, wallets et fonctionnalités seulement si vous en avez besoin",
  ],

  featuresTitle: "Ce que vous obtenez avec Vaultfolio",
  features: [
    {
      heading: "Une vue unifiée de vos actifs multi-chaînes",
      paragraphs: [
        "Ethereum, Polygon et Base disponibles aujourd'hui. Arbitrum, Optimism et Avalanche en cours de déploiement.",
        "Fini les allers-retours entre explorateurs. Vous voyez ce que vous détenez, dans le bon ordre, trié par valeur USD.",
      ],
    },
    {
      heading: "Un aperçu instantané de ce qui compte vraiment",
      paragraphs: [
        "Repérez en un coup d'œil vos plus grosses positions, identifiez ce qui monte ou baisse sur 24h, et voyez quelle chaîne concentre votre exposition.",
        "Vous passez moins de temps à vérifier vos wallets, et plus de temps à comprendre réellement votre portefeuille.",
      ],
    },
  ],
  nftSection: {
    heading: "Vos NFTs visibles, pas oubliés",
    paragraphs: [
      "Vos collectibles ERC-721 et ERC-1155 apparaissent avec images, grille visuelle et liens vers explorateur.",
      "Parce qu'un portefeuille Web3 ne se limite pas aux tokens fongibles.",
    ],
  },
  readOnlySection: {
    heading: "Votre wallet reste sous votre contrôle",
    paragraphs: [
      "Aucune seed phrase. Aucune autorisation de dépense. Aucune transaction à signer. Vaultfolio lit uniquement les adresses publiques.",
      "Vos fonds ne peuvent jamais être déplacés via Vaultfolio. Pour les débutants comme les utilisateurs avancés, c'est une garantie essentielle.",
    ],
  },
  profilesTitle: "Pensé pour les vrais usages du Web3",
  profiles: [
    { name: "Traders actifs", desc: "Suivre vos variations 24h, votre exposition et vos alertes sans perdre du temps." },
    { name: "Utilisateurs DeFi", desc: "Agréger vos positions sur Uniswap, Aave, Compound au même endroit." },
    { name: "Collectionneurs NFT", desc: "Visualiser rapidement vos NFTs, avec une présentation claire." },
    { name: "DAOs, trésoriers, advisors", desc: "Multi-wallet, exports, analytics et parfois white-label." },
    { name: "Débutants crypto", desc: "Une interface simple, sans jargon, pour comprendre enfin ce que vous possédez." },
  ],

  whyTitle: "Pourquoi les utilisateurs passent à Vaultfolio",
  whyLead: "Parce qu'ils veulent moins de friction… et plus de clarté.",
  whyPoints: [
    "une lecture centralisée de leur patrimoine",
    "une meilleure réactivité",
    "moins de charge mentale",
    "une compréhension plus rapide de leur exposition",
    "un suivi plus professionnel de leurs wallets",
  ],
  whyClosing: "Moins de confusion, plus de contrôle.",

  ctaEarlyTitle: "Si vous utilisez encore 3 explorateurs pour suivre 1 seul patrimoine…",
  ctaEarlyClosing: "il est temps de simplifier.",
  ctaEarlyPoints: [
    "vos soldes natifs",
    "vos tokens ERC-20",
    "vos NFTs",
    "vos prix live",
    "vos variations 24h",
    "vos positions DeFi selon votre plan",
    "vos wallets multi-chaînes sans confusion",
  ],

  objectionReadOnly: {
    q: "Et si je ne veux pas connecter mon wallet ?",
    a: "C'est une objection saine. La réponse : Vaultfolio fonctionne en lecture seule. Aucun mouvement de fonds. Aucune autorisation d'exécution. Aucun accès pour dépenser vos actifs. Vous gardez votre sécurité habituelle, avec en plus la simplicité d'un dashboard centralisé.",
  },
  objectionBeginner: {
    q: "Et si je débute seulement ?",
    a: "Justement. Vaultfolio n'a pas été pensé uniquement pour les experts DeFi qui parlent en acronymes toute la journée. L'interface vise aussi les utilisateurs qui veulent comprendre leurs avoirs, voir leurs actifs clairement, éviter le jargon inutile, démarrer simplement avec 1 wallet. Le plan gratuit est là pour ça.",
  },
  objectionMultiChain: {
    q: "Et si j'ai des actifs sur plusieurs chaînes ?",
    a: "C'est le cœur du produit. Vaultfolio unifie aujourd'hui Ethereum, Polygon et Base. Et le plan Pro/Whale étend cela à Arbitrum, Optimism, Avalanche, puis davantage encore selon le tier. Plus votre portefeuille devient fragmenté, plus Vaultfolio devient utile.",
  },

  buyTitle: "Ce que vous achetez vraiment",
  buyPoints: [
    "de la clarté",
    "du temps récupéré",
    "une meilleure lecture de votre patrimoine",
    "moins d'erreurs liées à la dispersion",
    "une façon plus sereine de suivre vos actifs Web3",
  ],

  riskTitle: "Essayez d'abord. Payez seulement si la valeur est évidente.",
  riskLead:
    "Le modèle freemium existe pour une raison simple : vous devez pouvoir vérifier par vous-même que Vaultfolio vous aide réellement.",
  riskPoints: [
    "Plan gratuit disponible",
    "Lecture seule",
    "Paiement sécurisé via Stripe Checkout",
    "Upgrade / downgrade selon vos besoins",
    "Aucune friction inutile pour commencer",
  ],
  riskClosing: "Vous n'avez pas besoin de \"croire\". Vous pouvez tester.",

  finalTitle: "Moins d'onglets. Moins d'oubli. Moins de flou.",
  finalItems: [
    "Plus de visibilité.",
    "Plus de contrôle.",
    "Plus de sérénité.",
  ],
  finalClosing: "Commencez maintenant.",

  startTitle: "Choisissez votre niveau d'accès",
  startTiers: [
    { name: "Starter", price: "0$", desc: "pour découvrir Vaultfolio", cta: "Commencer gratuitement" },
    { name: "Pro", price: "9$/mois ou 79$/an", desc: "pour un suivi Web3 sérieux", cta: "Passer en Pro" },
    { name: "Whale", price: "29$/mois ou 279$/an", desc: "pour les portefeuilles avancés et multi-wallets", cta: "Choisir Whale" },
  ],
  startSteps: [
    "Ajoutez votre wallet",
    "Visualisez vos actifs",
    "Débloquez plus de chaînes et de fonctionnalités si nécessaire",
  ],
  startCtaPrimary: "Essayer Vaultfolio gratuitement",
  startCtaSecondary: "Voir les plans Pro et Whale",

  faqTitle: "FAQ",
  faq: [
    { q: "Vaultfolio peut-il déplacer mes fonds ?", a: "Non. Vaultfolio est en lecture seule. Il lit les données on-chain de vos wallets sans autorisation de dépense. Aucune clé privée n'est jamais transmise." },
    { q: "Quelles chaînes sont prises en charge ?", a: "Starter inclut Ethereum et Polygon. Pro ajoute Base, Arbitrum, Optimism et Avalanche. Whale étend à plus de 20 chaînes dont Blast, Celo, Scroll et zkSync." },
    { q: "Puis-je suivre plusieurs wallets ?", a: "Oui. Le plan Free permet 1 wallet. Le plan Pro permet 3 wallets. Le plan Whale permet jusqu'à 20 wallets simultanés." },
    { q: "Les NFTs sont-ils visibles ?", a: "Oui. Les NFTs ERC-721 et ERC-1155 sont affichés avec leurs visuels, noms et liens vers l'explorateur de la blockchain." },
    { q: "D'où viennent les prix ?", a: "Les prix en temps réel sont fournis par l'API CoinGecko. Ils sont mis à jour toutes les minutes pour les tokens ERC-20 et les positions DeFi." },
    { q: "À qui s'adresse Vaultfolio ?", a: "Vaultfolio est conçu pour les investisseurs crypto particuliers, les traders, les utilisateurs DeFi, les collectionneurs NFT, les DAOs, les gestionnaires de trésorerie et les wealth managers crypto." },
    { q: "Comment fonctionne le paiement ?", a: "Les abonnements sont gérés exclusivement via Stripe Checkout. Vous pouvez choisir un paiement mensuel ou annuel avec réduction sur l'annuel." },
  ],

  pricingBadge: "Le plus populaire",
  tierNameFree: "Starter",
  tierNamePro: "Pro",
  tierNameWhale: "Whale",
  tierDescFree: "Gratuit pour toujours",
  tierDescPro: "Le meilleur point d'entrée pour les investisseurs actifs",
  tierDescWhale: "Pour les portefeuilles sérieux, les équipes et les opérateurs avancés",
  included: "Vous obtenez :",
  idealFor: "Idéal pour :",
};

const en: SalesCopy = {
  heroBadge: "100% Read-only · No signatures · Setup in 1 min",
  heroTitle: "Track your entire Web3 portfolio in one place",
  heroSubtitle:
    "Tokens, NFTs and multi-chain positions brought together in a clean, fast, 100% read-only dashboard.",
  heroLead:
    "Add a wallet address for free and get a consolidated view of your assets on Ethereum, Polygon and Base in seconds.",
  heroCta: "See my portfolio for free",
  heroCtaSecondary: "See how it works",
  trustBar: [
    "No seed phrase",
    "No transaction to sign",
    "100% read-only",
    "Setup in under 1 minute",
  ],

  socialProof: {
    stat1Value: "19",
    stat1Label: "chains supported",
    stat2Value: "$2.4M",
    stat2Label: "value tracked by users",
    stat3Value: "< 60s",
    stat3Label: "to see your portfolio",
    banner: "Already used by crypto investors on Ethereum, Polygon, Base and 16 other chains",
  },

  howItWorksTitle: "How it works",
  howItWorksSteps: [
    {
      title: "Add a wallet address",
      desc: "Paste a public address or connect your wallet. No signature required.",
    },
    {
      title: "Vaultfolio aggregates your assets",
      desc: "We read your balances, ERC-20 tokens, NFTs and live prices via CoinGecko — read-only.",
    },
    {
      title: "View your consolidated portfolio",
      desc: "Unified view by chain, wallet, token and NFT — sorted by descending USD value.",
    },
  ],

  problemTitle: "You don't have a portfolio problem.",
  problemSubtitle: "You have a visibility problem.",
  problemScenarios: [
    "You open Etherscan to check a balance.",
    "Then Polygonscan to see a token.",
    "Then Basescan to find an NFT.",
    "Then CoinGecko to confirm the price.",
  ],
  problemConclusion: "And in the end, you have data… but no big-picture view.",

  costTitle: "The real cost isn't the wasted time.",
  costSubtitle: "It's the decisions made blind.",
  costQuestions: [
    "How much is my portfolio really worth today?",
    "Which assets are up or down over 24h?",
    "Where are my most exposed tokens?",
    "What share of my wealth is locked in DeFi?",
    "Which wallets or NFT collections deserve my attention?",
  ],
  costConclusion: "Without a consolidated view, you react instead of steering.",
  costRisks: [
    "missing an opportunity",
    "forgetting assets",
    "underestimating your exposure",
    "wasting time manually rebuilding your situation",
  ],

  solutionIntro: "That's exactly why Vaultfolio exists.",
  solutionTitle:
    "A multi-chain Web3 portfolio dashboard that aggregates your on-chain assets in a simple, fast and readable interface.",
  solutionBody: [
    "You enter a wallet.",
    "Vaultfolio reads the data in read-only mode.",
    "And you instantly get a unified view of your holdings.",
  ],
  solutionGuarantees: [
    "No bridge to connect.",
    "No risky permissions.",
    "No need to switch between multiple explorers.",
  ],
  solutionClosing: "Just a clear, actionable and centralized view of your crypto wealth.",

  differentTitle: "What makes Vaultfolio different",
  differentLead:
    "Many Web3 tools are powerful… but complicated. Vaultfolio takes the opposite approach: wallet-first onboarding, read-only, clean interface, frictionless freemium.",
  differentPoints: [
    "you start for free",
    "you test the value immediately",
    "you visualize your assets without taking risks",
    "then you unlock more chains, wallets and features only if you need them",
  ],

  featuresTitle: "What you get with Vaultfolio",
  features: [
    {
      heading: "A unified view of your multi-chain assets",
      paragraphs: [
        "Ethereum, Polygon and Base available today. Arbitrum, Optimism and Avalanche being deployed.",
        "No more bouncing between explorers. You see what you hold, in the right order, sorted by USD value.",
      ],
    },
    {
      heading: "An instant snapshot of what truly matters",
      paragraphs: [
        "Spot your largest positions at a glance, identify what's up or down over 24h, and see which chain concentrates your exposure.",
        "Spend less time checking wallets and more time actually understanding your portfolio.",
      ],
    },
  ],
  nftSection: {
    heading: "Your NFTs visible, not forgotten",
    paragraphs: [
      "Your ERC-721 and ERC-1155 collectibles appear with images, visual grid and explorer links.",
      "Because a Web3 portfolio isn't limited to fungible tokens.",
    ],
  },
  readOnlySection: {
    heading: "Your wallet stays under your control",
    paragraphs: [
      "No seed phrase. No spending approvals. No transactions to sign. Vaultfolio only reads public addresses.",
      "Your funds can never be moved via Vaultfolio. For beginners and advanced users alike, that's an essential guarantee.",
    ],
  },
  profilesTitle: "Designed for real Web3 use cases",
  profiles: [
    { name: "Active traders", desc: "Track your 24h changes, exposure and alerts without wasting time." },
    { name: "DeFi users", desc: "Aggregate your Uniswap, Aave, Compound positions in one place." },
    { name: "NFT collectors", desc: "Quickly visualize your NFTs with a clean presentation." },
    { name: "DAOs, treasurers, advisors", desc: "Multi-wallet, exports, analytics and sometimes white-label." },
    { name: "Crypto beginners", desc: "A simple, jargon-free interface to finally understand what you own." },
  ],

  whyTitle: "Why users switch to Vaultfolio",
  whyLead: "Because they want less friction… and more clarity.",
  whyPoints: [
    "a centralized read of their wealth",
    "better responsiveness",
    "less mental load",
    "a faster understanding of their exposure",
    "a more professional wallet tracking",
  ],
  whyClosing: "Less confusion, more control.",

  ctaEarlyTitle: "If you still use 3 explorers to track 1 portfolio…",
  ctaEarlyClosing: "it's time to simplify.",
  ctaEarlyPoints: [
    "your native balances",
    "your ERC-20 tokens",
    "your NFTs",
    "your live prices",
    "your 24h changes",
    "your DeFi positions (by plan)",
    "your multi-chain wallets without confusion",
  ],

  objectionReadOnly: {
    q: "What if I don't want to connect my wallet?",
    a: "That's a healthy objection. The answer: Vaultfolio works in read-only mode. No fund movements. No execution authorizations. No access to spend your assets. You keep your usual security, plus the simplicity of a centralized dashboard.",
  },
  objectionBeginner: {
    q: "What if I'm just starting out?",
    a: "Exactly. Vaultfolio wasn't designed only for DeFi experts who speak in acronyms all day. The interface also targets users who want to understand their holdings, see their assets clearly, avoid unnecessary jargon, and start simply with 1 wallet. The free plan is there for that.",
  },
  objectionMultiChain: {
    q: "What if I have assets on multiple chains?",
    a: "That's the core of the product. Vaultfolio currently unifies Ethereum, Polygon and Base. And the Pro/Whale plan extends this to Arbitrum, Optimism, Avalanche, and more depending on the tier. The more fragmented your portfolio, the more useful Vaultfolio becomes.",
  },

  buyTitle: "What you're really buying",
  buyPoints: [
    "clarity",
    "recovered time",
    "a better read of your wealth",
    "fewer errors from fragmentation",
    "a calmer way to track your Web3 assets",
  ],

  riskTitle: "Try first. Pay only if the value is obvious.",
  riskLead:
    "The freemium model exists for a simple reason: you should be able to verify for yourself that Vaultfolio actually helps you.",
  riskPoints: [
    "Free plan available",
    "Read-only",
    "Secure payment via Stripe Checkout",
    "Upgrade / downgrade as needed",
    "No unnecessary friction to get started",
  ],
  riskClosing: "You don't need to \"believe\". You can test.",

  finalTitle: "Fewer tabs. Fewer oversights. Less fog.",
  finalItems: ["More visibility.", "More control.", "More peace of mind."],
  finalClosing: "Start now.",

  startTitle: "Choose your access level",
  startTiers: [
    { name: "Starter", price: "$0", desc: "to discover Vaultfolio", cta: "Start for free" },
    { name: "Pro", price: "$9/mo or $79/yr", desc: "for serious Web3 tracking", cta: "Go Pro" },
    { name: "Whale", price: "$29/mo or $279/yr", desc: "for advanced and multi-wallet portfolios", cta: "Choose Whale" },
  ],
  startSteps: [
    "Add your wallet",
    "Visualize your assets",
    "Unlock more chains and features if needed",
  ],
  startCtaPrimary: "Try Vaultfolio for free",
  startCtaSecondary: "See Pro and Whale plans",

  faqTitle: "FAQ",
  faq: [
    { q: "Can Vaultfolio move my funds?", a: "No. Vaultfolio is read-only. It reads on-chain data from your wallets without spending authorization. No private keys are ever transmitted." },
    { q: "Which chains are supported?", a: "Starter includes Ethereum and Polygon. Pro adds Base, Arbitrum, Optimism and Avalanche. Whale extends to 20+ chains including Blast, Celo, Scroll and zkSync." },
    { q: "Can I track multiple wallets?", a: "Yes. Free: 1 wallet. Pro: 3 wallets. Whale: up to 20 wallets simultaneously." },
    { q: "Are NFTs visible?", a: "Yes. ERC-721 and ERC-1155 NFTs are displayed with their visuals, names and blockchain explorer links." },
    { q: "Where do prices come from?", a: "Live prices are provided via the CoinGecko API. They are refreshed every minute for ERC-20 tokens and DeFi positions." },
    { q: "Who is Vaultfolio for?", a: "Vaultfolio is designed for retail crypto investors, traders, DeFi users, NFT collectors, DAOs, treasury managers and crypto wealth managers." },
    { q: "How does payment work?", a: "Subscriptions are managed exclusively via Stripe Checkout. You can choose monthly or yearly billing with a discount on the annual plan." },
  ],

  pricingBadge: "Most popular",
  tierNameFree: "Starter",
  tierNamePro: "Pro",
  tierNameWhale: "Whale",
  tierDescFree: "Free forever",
  tierDescPro: "The best entry point for active investors",
  tierDescWhale: "For serious portfolios, teams and advanced operators",
  included: "You get:",
  idealFor: "Ideal for:",
};

const ar: SalesCopy = {
  heroBadge: "100% قراءة فقط · لا توقيعات · إعداد في دقيقة",
  heroTitle: "تتبّع محفظتك Web3 بالكامل في مكان واحد",
  heroSubtitle:
    "رموز و NFTs ومراكز متعددة السلاسل مجتمعة في لوحة تحكم واضحة وسريعة وقراءة فقط 100%.",
  heroLead:
    "أضف عنوان محفظة مجاناً واحصل في ثوانٍ على رؤية موحّدة لأصولك على Ethereum و Polygon و Base.",
  heroCta: "شاهد محفظتي مجاناً",
  heroCtaSecondary: "شاهد كيف يعمل",
  trustBar: [
    "لا كلمات سرية",
    "لا معاملات للتوقيع",
    "قراءة فقط 100%",
    "إعداد في أقل من دقيقة",
  ],

  socialProof: {
    stat1Value: "19",
    stat1Label: "سلسلة مدعومة",
    stat2Value: "$2.4M",
    stat2Label: "قيمة يتتبّعها المستخدمون",
    stat3Value: "< 60ث",
    stat3Label: "لرؤية محفظتك",
    banner: "يستخدمه مستثمرو الكريبتو على Ethereum و Polygon و Base و16 سلسلة أخرى",
  },

  howItWorksTitle: "كيف يعمل",
  howItWorksSteps: [
    {
      title: "أضف عنوان محفظة",
      desc: "الصق عنواناً عاماً أو اربط محفظتك. لا توقيع مطلوب.",
    },
    {
      title: "يجمع Vaultfolio أصولك",
      desc: "نقرأ أرصدتك ورموز ERC-20 و NFTs والأسعار الحية عبر CoinGecko — قراءة فقط.",
    },
    {
      title: "اعرض محفظتك الموحّدة",
      desc: "رؤية موحّدة حسب السلسلة والمحفظة والرمز و NFT — مرتّبة حسب قيمة USD تنازلياً.",
    },
  ],

  problemTitle: "ليست لديك مشكلة محفظة.",
  problemSubtitle: "لديك مشكلة رؤية.",
  problemScenarios: [
    "تفتح Etherscan للتحقق من رصيد.",
    "ثم Polygonscan لرؤية رمز.",
    "ثم Basescan للعثور على NFT.",
    "ثم CoinGecko لتأكيد السعر.",
  ],
  problemConclusion: "وفي النهاية، لديك بيانات… لكن لا رؤية شاملة.",

  costTitle: "التكلفة الحقيقية ليست الوقت الضائع.",
  costSubtitle: "بل القرارات المتّخذة على عمياء.",
  costQuestions: [
    "كم تساوي محفظتي حقاً اليوم؟",
    "أي الأصول ترتفع أو تنخفض خلال 24 ساعة؟",
    "أين توجد رموزي الأكثر تعرّضاً؟",
    "ما نسبة ثروتي المحتجزة في DeFi؟",
    "أي محافظ أو مجموعات NFT تستحق اهتمامي؟",
  ],
  costConclusion: "بدون رؤية موحّدة، أنت تتفاعل بدلاً من القيادة.",
  costRisks: [
    "تفويت فرصة",
    "نسيان أصول",
    "التقليل من تعرّضك",
    "إضاعة الوقت في إعادة بناء وضعك يدوياً",
  ],

  solutionIntro: "لهذا السبب بالذات وُجد Vaultfolio.",
  solutionTitle:
    "لوحة تحكم محفظة Web3 متعددة السلاسل تجمع أصولك on-chain في واجهة بسيطة وسريعة وواضحة.",
  solutionBody: [
    "تُدخل محفظة.",
    "يقرأ Vaultfolio البيانات في وضع القراءة فقط.",
    "وتحصل فوراً على رؤية موحّدة لمقتنياتك.",
  ],
  solutionGuarantees: [
    "لا جسر للاتصال.",
    "لا أذونات خطرة.",
    "لا حاجة للتنقل بين عدة مستكشفين.",
  ],
  solutionClosing: "فقط رؤية واضحة وقابلة للتنفيذ ومركزية لثروتك الرقمية.",

  differentTitle: "ما الذي يميّز Vaultfolio",
  differentLead:
    "العديد من أدوات Web3 قوية… لكن معقّدة. يتّخذ Vaultfolio النهج المعاكس: onboarding يبدأ بالمحفظة، قراءة فقط، واجهة واضحة، freemium بلا احتكاك.",
  differentPoints: [
    "تبدأ مجاناً",
    "تختبر القيمة فوراً",
    "تتصوّر أصولك دون مخاطرة",
    "ثم تفتح المزيد من السلاسل والمحافظ والميزات فقط عند الحاجة",
  ],

  featuresTitle: "ما الذي تحصل عليه مع Vaultfolio",
  features: [
    {
      heading: "رؤية موحّدة لأصولك متعددة السلاسل",
      paragraphs: [
        "Ethereum و Polygon و Base متاحة اليوم. Arbitrum و Optimism و Avalanche قيد النشر.",
        "لا مزيد من التنقل بين المستكشفين. ترى ما تملكه، بالترتيب الصحيح، مرتّباً حسب قيمة USD.",
      ],
    },
    {
      heading: "لمحة فورية لما يهمّ حقاً",
      paragraphs: [
        "تحدّد أكبر مراكزك بنظرة، وتعرف ما يرتفع أو ينخفض خلال 24 ساعة، وترى أي سلسلة تركّز تعرّضك.",
        "تقضي وقتاً أقل في فحص محافظك ووقتاً أكثر في فهم محفظتك حقاً.",
      ],
    },
  ],
  nftSection: {
    heading: "NFTs مرئية، لا منسية",
    paragraphs: [
      "تظهر مقتنياتك ERC-721 و ERC-1155 مع الصور وشبكة بصرية وروابط المستكشف.",
      "لأن محفظة Web3 لا تقتصر على الرموز القابلة للاستبدال.",
    ],
  },
  readOnlySection: {
    heading: "محفظتك تبقى تحت سيطرتك",
    paragraphs: [
      "لا كلمات سرية. لا أذونات إنفاق. لا معاملات للتوقيع. يقرأ Vaultfolio العناوين العامة فقط.",
      "لا يمكن تحريك أموالك أبداً عبر Vaultfolio. للمبتدئين والمستخدمين المتقدمين، هذه ضمانة أساسية.",
    ],
  },
  profilesTitle: "مصمّم لاستخدامات Web3 الحقيقية",
  profiles: [
    { name: "المتداولون النشطون", desc: "تتبّع تغيّرات 24 ساعة وتعرّضك وتنبيهاتك دون إضاعة وقت." },
    { name: "مستخدمو DeFi", desc: "تجميع مراكزك على Uniswap و Aave و Compound في مكان واحد." },
    { name: "جامعو NFT", desc: "تصوّر NFTs بسرعة بطريقة عرض واضحة." },
    { name: "DAOs، أمين الخزينة، المستشارون", desc: "محافظ متعددة، تصدير، تحليلات وأحياناً white-label." },
    { name: "مبتدئو الكريبتو", desc: "واجهة بسيطة بلا مصطلحات لفهم ما تملكه أخيراً." },
  ],

  whyTitle: "لماذا ينتقل المستخدمون إلى Vaultfolio",
  whyLead: "لأنهم يريدون احتكاكاً أقل… ووضوحاً أكثر.",
  whyPoints: [
    "قراءة مركزية لثروتهم",
    "استجابة أفضل",
    "عبء ذهني أقل",
    "فهم أسرع لتعرّضهم",
    "تتبّع أكثر احترافية لمحافظهم",
  ],
  whyClosing: "ارتباك أقل، سيطرة أكثر.",

  ctaEarlyTitle: "إذا كنت لا تزال تستخدم 3 مستكشفين لتتبّع محفظة واحدة…",
  ctaEarlyClosing: "حان وقت التبسيط.",
  ctaEarlyPoints: [
    "أرصدتك الأصلية",
    "رموز ERC-20",
    "NFTs",
    "أسعارك الحية",
    "تغيّرات 24 ساعة",
    "مراكز DeFi (حسب الخطة)",
    "محافظك متعددة السلاسل بلا ارتباك",
  ],

  objectionReadOnly: {
    q: "ماذا لو لا أريد ربط محفظتي؟",
    a: "هذا اعتراض سليم. الإجابة: يعمل Vaultfolio في وضع القراءة فقط. لا تحريك أموال. لا أذونات تنفيذ. لا وصول لإنفاق أصولك. تحتفظ بأمانك المعتاد، بالإضافة لبساطة لوحة تحكم مركزية.",
  },
  objectionBeginner: {
    q: "ماذا لو أنا مبتدئ فقط؟",
    a: "بالضبط. لم يُصمّم Vaultfolio فقط لخبراء DeFi الذين يتحدّثون بالاختصارات طوال اليوم. تستهدف الواجهة أيضاً المستخدمين الذين يريدون فهم مقتنياتهم ورؤية أصولهم بوضوح وتجنّب المصطلحات غير الضرورية والبدء ببساطة بمحفظة واحدة. الخطة المجانية موجودة لذلك.",
  },
  objectionMultiChain: {
    q: "ماذا لو لديّ أصول على عدة سلاسل؟",
    a: "هذا جوهر المنتج. يوحّد Vaultfolio حالياً Ethereum و Polygon و Base. وتمتد خطة Pro/Whale إلى Arbitrum و Optimism و Avalanche والمزيد حسب المستوى. كلما تفتّتت محفظتك أكثر، أصبح Vaultfolio أكثر فائدة.",
  },

  buyTitle: "ما تشتريه حقاً",
  buyPoints: [
    "وضوحاً",
    "وقتاً مستعاداً",
    "قراءة أفضل لثروتك",
    "أخطاء أقل ناتجة عن التشتت",
    "طريقة أكثر هدوءاً لتتبّع أصول Web3",
  ],

  riskTitle: "جرّب أولاً. ادفع فقط إذا كانت القيمة واضحة.",
  riskLead:
    "نموذج freemium موجود لسبب بسيط: يجب أن تتمكّن من التحقّق بنفسك من أن Vaultfolio يساعدك حقاً.",
  riskPoints: [
    "خطة مجانية متاحة",
    "قراءة فقط",
    "دفع آمن عبر Stripe Checkout",
    "ترقية / تخفيض حسب الحاجة",
    "لا احتكاك غير ضروري للبدء",
  ],
  riskClosing: "لا تحتاج لـ\"الإيمان\". يمكنك الاختبار.",

  finalTitle: "تبويبات أقل. إغفالات أقل. ضباب أقل.",
  finalItems: ["رؤية أكثر.", "سيطرة أكثر.", "راحة بال أكثر."],
  finalClosing: "ابدأ الآن.",

  startTitle: "اختر مستوى وصولك",
  startTiers: [
    { name: "Starter", price: "0$", desc: "لاكتشاف Vaultfolio", cta: "ابدأ مجاناً" },
    { name: "Pro", price: "9$/شهر أو 79$/سنة", desc: "لتتبّع Web3 جاد", cta: "انتقل إلى Pro" },
    { name: "Whale", price: "29$/شهر أو 279$/سنة", desc: "للمحافظ المتقدمة ومتعددة المحافظ", cta: "اختر Whale" },
  ],
  startSteps: [
    "أضف محفظتك",
    "تصوّر أصولك",
    "افتح المزيد من السلاسل والميزات عند الحاجة",
  ],
  startCtaPrimary: "جرّب Vaultfolio مجاناً",
  startCtaSecondary: "شاهد خطط Pro و Whale",

  faqTitle: "الأسئلة الشائعة",
  faq: [
    { q: "هل يمكن لـ Vaultfolio تحريك أموالي؟", a: "لا. Vaultfolio للقراءة فقط. يقرأ بيانات on-chain من محافظك دون إذن إنفاق. لا تُرسل أي مفاتيح خاصة." },
    { q: "ما السلاسل المدعومة؟", a: "تشمل Starter: Ethereum و Polygon. يضيف Pro: Base و Arbitrum و Optimism و Avalanche. يمتد Whale إلى أكثر من 20 سلسلة بما فيها Blast و Celo و Scroll و zkSync." },
    { q: "هل يمكنني تتبّع محافظ متعددة؟", a: "نعم. مجاني: محفظة واحدة. Pro: 3 محافظ. Whale: حتى 20 محفظة في وقت واحد." },
    { q: "هل NFTs مرئية؟", a: "نعم. تُعرض NFTs ERC-721 و ERC-1155 مع صورها وأسمائها وروابط المستكشف." },
    { q: "من أين تأتي الأسعار؟", a: "الأسعار الحية تأتي من واجهة CoinGecko API وتُحدّث كل دقيقة للرموز ERC-20 والمراكز DeFi." },
    { q: "لمن موجّه Vaultfolio؟", a: "Vaultfolio موجّه للمستثمرين الأفراد، المتداولين، مستخدمي DeFi، جامعي NFTs، DAOs، مديري الخزينة ومديري ثروات الكريبتو." },
    { q: "كيف يعمل الدفع؟", a: "تُدار الاشتراكات حصرياً عبر Stripe Checkout. يمكنك الاختيار بين الدفع الشهري أو السنوي مع خصم على الخطة السنوية." },
  ],

  pricingBadge: "الأكثر شيوعاً",
  tierNameFree: "Starter",
  tierNamePro: "Pro",
  tierNameWhale: "Whale",
  tierDescFree: "مجاني للأبد",
  tierDescPro: "أفضل نقطة دخول للمستثمرين النشطين",
  tierDescWhale: "للمحافظ الجادة والفرق والمشغّلين المتقدمين",
  included: "تحصل على:",
  idealFor: "مثالي لـ:",
};

export const salesCopy: Record<Locale, SalesCopy> = { en, fr, ar };

export function getSalesCopy(locale: Locale): SalesCopy {
  return salesCopy[locale] ?? salesCopy.en;
}