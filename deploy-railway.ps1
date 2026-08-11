# deploy-railway.ps1
# Deploys the Voice Proxy backend to Railway
# Usage: .\deploy-railway.ps1

Write-Host "🚂 Railway Voice Proxy Deployment" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
if (-not (Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Railway CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Login check
Write-Host "Checking Railway login..." -ForegroundColor Gray
railway whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway first:" -ForegroundColor Yellow
    railway login
}

# Set environment variables
Write-Host ""
Write-Host "Setting Railway environment variables..." -ForegroundColor Cyan

railway variables set NODE_ENV=production
railway variables set PORT=8080

# Prompt for sensitive keys
$openaiKey = Read-Host "Enter OPENAI_API_KEY (sk-proj-...)" -AsSecureString
$openaiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($openaiKey))
railway variables set OPENAI_API_KEY=$openaiKeyPlain

$redisUrl = Read-Host "Enter UPSTASH_REDIS_REST_URL (https://...)"
railway variables set UPSTASH_REDIS_REST_URL=$redisUrl

$redisToken = Read-Host "Enter UPSTASH_REDIS_REST_TOKEN" -AsSecureString
$redisTokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($redisToken))
railway variables set UPSTASH_REDIS_REST_TOKEN=$redisTokenPlain

Write-Host ""
Write-Host "✅ Environment variables configured" -ForegroundColor Green

# Deploy
Write-Host ""
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Cyan
railway up

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "Copy the generated URL (wss://voice-proxy-xxx.up.railway.app) and add it to Vercel as NEXT_PUBLIC_VOICE_PROXY_URL" -ForegroundColor Yellow
