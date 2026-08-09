# Vaultfolio — Multi-chain Web3 Portfolio Dashboard

A read-only Web3 portfolio dashboard that aggregates native balances, ERC-20 tokens and NFTs across **Ethereum**, **Polygon** and **Base**. Real-time USD prices via CoinGecko. Multilingual (EN / FR / AR with RTL). **Freemium SaaS with Stripe billing.**

## Stack

- **Next.js 14** (App Router) + **React 18** + **TypeScript**
- **Wagmi 2** + **Viem 2** for on-chain reads
- **RainbowKit 2** for wallet connection (MetaMask, WalletConnect, etc.)
- **Stripe** for subscription billing (Checkout + webhooks)
- **Upstash Redis** for serverless subscription state storage
- **Tailwind CSS 3** dark UI
- Custom i18n (no external dep) — EN / FR / AR

## Features

### Portfolio (free)
- Connect any EVM wallet (MetaMask, Coinbase, WalletConnect, Rabby…)
- Native balances: ETH (Ethereum), MATIC (Polygon)
- ERC-20 token balances with metadata + logos
- NFT collectibles (ERC-721 / ERC-1155) grid with images
- Live USD pricing via CoinGecko API, sorted by value
- 24h price change indicators
- Per-chain badges and explorer links
- Multilingual UI with RTL support for Arabic
- Refresh button to re-fetch on-chain data
- Read-only — **zero signatures, zero approvals, zero risk**

### Monetization — 3 tiers

| Tier | Price | Chains | Wallets | DeFi | Alerts | Export |
|------|-------|--------|---------|------|--------|--------|
| **Starter (Free)** | $0 | 2 (ETH + Polygon) | 1 | — | — | — |
| **Pro** | $9/mo or $79/yr | 6 | 3 | ✓ | ✓ | ✓ |
| **Whale** | $29/mo or $279/yr | 20+ | 20 | ✓ | ✓ | ✓ + analytics |

- Stripe Checkout subscription flow (monthly or yearly billing)
- Webhook syncs subscription status to Upstash Redis by wallet address
- Paywall overlay on locked features
- Pricing page with billing toggle and tier comparison
- Manage / cancel subscription from pricing page
- Free users see locked-chain teaser with upgrade CTA

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000 and connect your wallet.

### Stripe webhook (local dev)

```bash
npm install -g stripe
stripe listen --forward-to localhost:3000/api/stripe-webhook
```

Copy the `whsec_...` secret from the CLI output to your `.env`.

## Production build

```bash
npm run build
npm run start
```

## Deploy

Works out-of-the-box on **Vercel**:

```bash
vercel
```

## Configuration

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Your app URL (for Stripe redirect URLs) |
| `NEXT_PUBLIC_WC_PROJECT_ID` | WalletConnect Cloud project ID (cloud.walletconnect.com) |
| `STRIPE_SECRET_KEY` | Stripe secret key (dashboard.stripe.com) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRICE_PRO_MONTHLY` | Stripe Price ID for Pro monthly |
| `STRIPE_PRICE_PRO_YEARLY` | Stripe Price ID for Pro yearly |
| `STRIPE_PRICE_WHALE_MONTHLY` | Stripe Price ID for Whale monthly |
| `STRIPE_PRICE_WHALE_YEARLY` | Stripe Price ID for Whale yearly |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL (console.upstash.com) |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |

### Stripe setup

1. Create 4 recurring products in Stripe Dashboard: Pro Monthly ($9), Pro Yearly ($79), Whale Monthly ($29), Whale Yearly ($279)
2. Copy each Price ID (`price_...`) into `.env.local`
3. Create a webhook endpoint pointing to `https://yourapp.com/api/stripe-webhook`
4. Add the webhook signing secret to `STRIPE_WEBHOOK_SECRET`

### Upstash Redis setup

1. Create a free Redis database at console.upstash.com
2. Copy the REST URL and token into `.env.local`
3. Subscription state is stored as `vaultfolio:sub:<address>` (JSON)

**Note:** If Redis is not configured, the app gracefully degrades — all users are treated as free tier. The app still works, just no paid features unlock.

## Architecture

```
src/
├── app/
│   ├── globals.css              # Tailwind + base styles
│   ├── layout.tsx              # Root layout, metadata, fonts, Providers
│   ├── page.tsx                 # Landing hero + portfolio dashboard (paywall gating)
│   ├── pricing/page.tsx         # Pricing page with tier cards + billing toggle
│   ├── providers.tsx            # Wagmi + QueryClient + RainbowKit + i18n
│   └── api/
│       ├── create-checkout/route.ts   # Stripe Checkout session creation
│       ├── stripe-webhook/route.ts     # Stripe webhook → Redis sync
│       ├── check-subscription/route.ts # Read sub status from Redis
│       └── cancel-subscription/route.ts # Cancel active subscription
├── components/
│   ├── Header.tsx               # App bar + language switcher + ConnectButton
│   ├── StatCard.tsx             # Stat cards (net worth, tokens, NFTs, chains)
│   ├── TokenList.tsx             # ERC-20 + native balance rows
│   ├── NftGrid.tsx               # NFT collectibles grid
│   ├── PaywallOverlay.tsx       # Modal prompting upgrade
│   └── Footer.tsx               # Footer + copy address button
├── i18n/
│   ├── config.ts                # Locales, messages (EN/FR/AR), helpers
│   └── I18nProvider.tsx         # React context provider + useI18n hook
└── lib/
    ├── chains.ts                # Wagmi/RainbowKit config + chain metadata
    ├── stripe.ts                # Stripe client + tier config (Free/Pro/Whale)
    ├── store.ts                 # Upstash Redis: get/set subscription by wallet
    ├── useSubscription.ts        # React hook: fetch tier, checkout, cancel
    ├── format.ts                # Number/currency/address formatting
    ├── prices.ts                # CoinGecko fetch + types
    ├── tokens.ts                # Known ERC-20 addresses per chain + ABI
    └── useChainReader.ts        # On-chain balance + NFT readers (multicall)
```

## License

MIT — use it freely.