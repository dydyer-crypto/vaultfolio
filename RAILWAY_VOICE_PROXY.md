# Railway Voice Proxy Deployment

## Overview

Le **Voice Widget** (OpenAI Realtime WebSocket) ne peut pas être déployé sur Vercel car il nécessite des connexions persistantes.  
Il doit être déployé sur **Railway** (ou Fly.io / Render).

---

## Fichiers de Configuration

### 1. `Dockerfile`

```dockerfile
# Railway Voice Proxy - Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev for build if needed)
RUN npm ci

# Copy source
COPY . .

# Build the custom server
RUN npm run build:server || echo "No build:server script, using pre-built .server-build"

# Production image
FROM node:20-alpine

WORKDIR /app

# Copy only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built server
COPY --from=builder /app/.server-build ./server

# Expose port (Railway will override with $PORT)
EXPOSE 8080

# Start the voice proxy server
CMD ["node", "server/server.js"]
```

### 2. `railway.json` (Optionnel mais recommandé)

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10,
    "sleepApplication": false
  }
}
```

### 3. `.railwayignore`

```
# Ignore frontend files (only deploy the voice proxy)
.next/
node_modules/
src/
app/
components/
content/
hooks/
i18n/
lib/
public/
!public/robots.txt
!public/llms.txt
*.md
*.log
.env*
!.env.example
.vercel/
.git/
```

---

## Variables d'Environnement (Railway)

Dans **Railway Dashboard → Variables**, ajoute :

```env
NODE_ENV=production
PORT=8080

# OpenAI Realtime
OPENAI_API_KEY=sk-proj-...

# Upstash Redis (rate limiting + budget)
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Optionnel : logging
LOG_LEVEL=info
```

---

## Étapes de Déploiement sur Railway

### 1. Créer un compte Railway
https://railway.app

### 2. Nouveau Projet

```bash
# Via CLI (recommandé)
npm i -g @railway/cli
railway login
railway init
```

Ou via l'interface web :
1. Dashboard → **New Project**
2. **Deploy from GitHub repo**
3. Sélectionne `dydyer-crypto/vaultfolio`

### 3. Configurer le Build

Railway détecte automatiquement le `Dockerfile` si présent.

Si tu utilises le CLI :

```bash
railway up
```

### 4. Ajouter les Variables d'Environnement

```bash
railway variables set NODE_ENV=production
railway variables set PORT=8080
railway variables set OPENAI_API_KEY=sk-proj-...
railway variables set UPSTASH_REDIS_REST_URL=https://...
railway variables set UPSTASH_REDIS_REST_TOKEN=...
```

Ou via l'interface :
**Settings → Variables → Add Variable**

### 5. Générer l'URL Publique

Après le premier déploiement réussi, Railway te donne une URL du type :
`https://voice-proxy-production-xxx.up.railway.app`

**Note :** Le WebSocket sera accessible sur :
`wss://voice-proxy-production-xxx.up.railway.app`

---

## Connexion Frontend ↔ Backend

### Modifier `src/components/VoiceWidget.tsx`

```tsx
const getVoiceProxyUrl = () => {
  if (typeof window === 'undefined') return '';

  const isProd = window.location.hostname.includes('vaultfolio.pro');

  if (isProd) {
    // Production : pointer vers Railway
    return 'wss://voice-proxy-production-xxx.up.railway.app';
  }

  // Local dev
  return 'ws://localhost:8080';
};

const WS_PROXY_URL = getVoiceProxyUrl();
```

### Variables d'Environnement Frontend (Vercel)

Ajoute dans Vercel :

```
NEXT_PUBLIC_VOICE_PROXY_URL=wss://voice-proxy-production-xxx.up.railway.app
```

Puis utilise-la dans le composant :

```tsx
const WS_PROXY_URL = process.env.NEXT_PUBLIC_VOICE_PROXY_URL || 'ws://localhost:8080';
```

---

## Monitoring & Logs

### Railway Logs

```bash
railway logs
```

Ou via l'interface : **Deployments → View Logs**

### Health Check (Optionnel)

Ajoute un endpoint `/health` dans `server.js` si tu veux un healthcheck Railway :

```js
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});
```

Puis configure dans Railway :
**Settings → Healthcheck Path** = `/health`

---

## Coûts Estimés (Railway)

| Usage | Coût |
|-------|------|
| Hobby plan | Gratuit (limité) |
| Pro plan | ~$5-20/mois |
| Voice proxy (faible trafic) | ~$3-8/mois |

---

## Checklist Déploiement

- [ ] `Dockerfile` présent à la racine
- [ ] `railway.json` présent (optionnel)
- [ ] `.railwayignore` présent
- [ ] Variables d'environnement configurées sur Railway
- [ ] Frontend mis à jour avec `NEXT_PUBLIC_VOICE_PROXY_URL`
- [ ] Test WebSocket depuis le frontend en production
- [ ] Logs Railway sans erreur

---

## Troubleshooting

### Erreur "Cannot find module"
→ Vérifie que `.server-build/server.js` est bien copié dans l'image Docker.

### WebSocket connection refused
→ Vérifie que `PORT=8080` est bien défini et que Railway expose le bon port.

### Redis connection error
→ Vérifie les variables `UPSTASH_REDIS_REST_URL` et `UPSTASH_REDIS_REST_TOKEN`.

### OpenAI 403 / Unauthorized
→ Vérifie que `OPENAI_API_KEY` est valide et a accès au modèle `gpt-realtime`.

---

**Dernière mise à jour :** 11 août 2026
**Projet :** Vaultfolio
**Backend :** Railway Voice Proxy
