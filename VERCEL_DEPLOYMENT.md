# Vercel Deployment Guide — Vaultfolio

## Architecture

**Frontend (Dashboard + Marketing)**
- Next.js 14 App Router
- Deployed on Vercel (Edge + Serverless)
- Static assets + API routes (non-WebSocket)

**Voice Widget (WebSocket)**
- Custom Node.js server with `ws` library
- **NOT deployable on Vercel** (Vercel serverless ne supporte pas les connexions WebSocket persistantes)
- Deployé séparément sur Railway / Fly.io / Render

---

## Étape 1 : Préparer le Frontend pour Vercel

### 1.1 Vérifier `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

> ⚠️ Le script `start` actuel (`next build && npm run build:server && ...`) est incompatible avec Vercel.  
> Utilisez `next start` pour le déploiement Vercel.

### 1.2 Créer `vercel.json` (déjà fait)

Le fichier `vercel.json` a été créé avec :
- Framework Next.js
- Headers de sécurité
- Cache optimisé pour `llms.txt`
- Région Europe (fra1)

### 1.3 Variables d'Environnement Requises (Frontend)

Dans **Vercel Dashboard → Settings → Environment Variables** :

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=re_...
NEXT_PUBLIC_APP_URL=https://vaultfolio.pro
```

> Les clés liées au **voice proxy** (OpenAI Realtime) seront gérées par le backend séparé.

---

## Étape 2 : Déploiement Frontend sur Vercel

### Option A — Via GitHub (Recommandé)

1. Push le code sur GitHub (déjà fait ✅)
2. Aller sur [vercel.com/new](https://vercel.com/new)
3. Importer le repo `dydyer-crypto/vaultfolio`
4. Vercel détecte automatiquement Next.js
5. Ajouter les variables d'environnement
6. Cliquer **Deploy**

### Option B — Via CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## Étape 3 : Backend Voice Proxy (WebSocket)

### 3.1 Pourquoi un backend séparé ?

Le fichier `.server-build/server.js` utilise :
- `ws` (WebSocket library)
- Connexions persistantes OpenAI Realtime
- Rate limiting + budget tracking via Redis

Vercel **ne supporte pas** les WebSockets sur le runtime serverless standard.

### 3.2 Plateformes Recommandées

| Plateforme | Prix | WebSocket | Région EU | Recommandé |
|------------|------|-----------|-----------|------------|
| **Railway** | ~$5-20/mo | ✅ Natif | ✅ | ⭐⭐⭐⭐⭐ |
| **Fly.io** | ~$5-15/mo | ✅ Natif | ✅ | ⭐⭐⭐⭐ |
| **Render** | Free / $7/mo | ✅ Natif | ⚠️ US only | ⭐⭐⭐ |
| **VPS (Hetzner)** | ~€4/mo | ✅ | ✅ | ⭐⭐⭐⭐ |

### 3.3 Déploiement sur Railway (Exemple)

```bash
# 1. Créer un nouveau projet Railway
railway init

# 2. Ajouter les variables d'environnement
railway variables set OPENAI_API_KEY=sk-...
railway variables set UPSTASH_REDIS_REST_URL=...
railway variables set UPSTASH_REDIS_REST_TOKEN=...
railway variables set PORT=8080

# 3. Déployer
railway up
```

### 3.4 Adapter le Voice Widget pour pointer vers le backend

Modifier `src/components/VoiceWidget.tsx` :

```tsx
const WS_PROXY_URL =
  process.env.NODE_ENV === 'production'
    ? 'wss://voice-proxy.railway.app'  // ← URL du backend Railway
    : 'ws://localhost:8080';
```

---

## Étape 4 : Configuration DNS & Domaines

### 4.1 Domaine Principal

- `vaultfolio.pro` → Vercel (Frontend)
- `api.vaultfolio.pro` → Railway (Voice Proxy) — optionnel

### 4.2 Vercel Custom Domain

1. Vercel Dashboard → Settings → Domains
2. Ajouter `vaultfolio.pro`
3. Suivre les instructions DNS (CNAME ou A record)

### 4.3 Headers CORS (si besoin)

Ajouter dans `vercel.json` si le voice proxy est sur un domaine différent :

```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://vaultfolio.pro" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,OPTIONS" }
      ]
    }
  ]
}
```

---

## Étape 5 : Vérification Post-Déploiement

### Checklist SEO/GEO

- [ ] `https://vaultfolio.pro/robots.txt` → AI crawlers autorisés
- [ ] `https://vaultfolio.pro/llms.txt` → accessible et valide
- [ ] `https://vaultfolio.pro/sitemap.xml` → présent et valide
- [ ] Schema JSON-LD présent dans le `<head>` (via DevTools)
- [ ] hreflang tags présents (`en`, `fr`, `ar`, `x-default`)
- [ ] Lighthouse SEO score ≥ 95

### Checklist Fonctionnelle

- [ ] Wallet connection (RainbowKit) fonctionne
- [ ] Stripe Checkout redirige correctement
- [ ] Pricing tiers visibles et cliquables
- [ ] Voice widget désactivé ou affiche "Coming soon" (si backend pas encore prêt)

---

## Étape 6 : Monitoring & Analytics

### 6.1 Vercel Analytics (Optionnel)

```bash
npm install @vercel/analytics
```

Ajouter dans `layout.tsx` :

```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 6.2 Sentry (Optionnel pour Error Tracking)

```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Résumé des URLs Finales

| Service | URL | Plateforme |
|---------|-----|------------|
| Frontend + Marketing | https://vaultfolio.pro | Vercel |
| Voice Proxy (WebSocket) | wss://voice.vaultfolio.pro | Railway |
| Admin / Logs | https://railway.app/project/... | Railway Dashboard |
| Redis (Upstash) | https://console.upstash.com/... | Upstash Dashboard |

---

## Commandes Utiles

```bash
# Local
npm run dev

# Build production (frontend only)
npm run build

# Deploy to Vercel (CLI)
vercel --prod

# Deploy to Railway (backend)
railway up
```

---

**Dernière mise à jour :** 11 août 2026
**Auteur :** Kilo + GEO Audit Pipeline
