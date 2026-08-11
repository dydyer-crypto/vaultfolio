# wait-and-deploy-railway.ps1
# Waits for Railway incident to resolve, then deploys the Voice Proxy
# Usage: .\wait-and-deploy-railway.ps1

param(
    [int]$MaxRetries = 12,      # 12 retries * 5 min = 1 hour max
    [int]$RetryDelayMinutes = 5
)

Write-Host "[Railway] Auto-Deploy Waiter" -ForegroundColor Cyan
Write-Host "This script will retry deployment until Railway is healthy." -ForegroundColor Gray
Write-Host ""

# ── Ensure a project is linked ──
Write-Host "Checking Railway project link..." -ForegroundColor Gray
$linkCheck = & railway status 2>&1
if ($linkCheck -match "No linked project|not linked|run `railway link`") {
    Write-Host "[WARN] No Railway project linked in this folder." -ForegroundColor Yellow
    Write-Host "Launching 'railway link'..." -ForegroundColor Cyan
    railway link
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] railway link failed or was cancelled. Exiting." -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Project linked successfully." -ForegroundColor Green
}

$retryCount = 0
$success = $false

while (-not $success -and $retryCount -lt $MaxRetries) {
    $retryCount++
    Write-Host ""
    Write-Host "[$retryCount/$MaxRetries] Attempting deployment..." -ForegroundColor Yellow

    # Run railway up and capture output
    $output = & railway up 2>&1
    $exitCode = $LASTEXITCODE

    if ($exitCode -eq 0) {
        Write-Host "[OK] Deployment successful!" -ForegroundColor Green
        $success = $true
        break
    }

    # Check if it's the known Railpack incident
    $outputString = $output | Out-String
    if ($outputString -match "railpack|Railpack|build.*fail|extended build time") {
        Write-Host "[WARN] Detected Railpack incident. Waiting $RetryDelayMinutes minutes before retry..." -ForegroundColor Yellow
    } else {
        Write-Host "[WARN] Deployment failed with unknown error. Waiting $RetryDelayMinutes minutes..." -ForegroundColor Yellow
        Write-Host "Last output:" -ForegroundColor DarkGray
        Write-Host $outputString -ForegroundColor DarkGray
    }

    if ($retryCount -lt $MaxRetries) {
        Write-Host "Sleeping for $RetryDelayMinutes minutes... (Ctrl+C to cancel)" -ForegroundColor Gray
        Start-Sleep -Seconds ($RetryDelayMinutes * 60)
    }
}

if (-not $success) {
    Write-Host ""
    Write-Host "[ERROR] Max retries reached ($MaxRetries). Please check Railway status manually:" -ForegroundColor Red
    Write-Host "   https://status.railway.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can run this script again later or deploy manually with:" -ForegroundColor Yellow
    Write-Host "   railway up" -ForegroundColor White
    exit 1
}

Write-Host ""
Write-Host "[SUCCESS] Voice Proxy is now deployed on Railway!" -ForegroundColor Green
Write-Host "Copy the generated URL and add it to Vercel as NEXT_PUBLIC_VOICE_PROXY_URL" -ForegroundColor Yellow
