Set-Location -Path $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  💎 Starting Zovira Next-Gen 3D E-Commerce Store" -ForegroundColor Cyan
Write-Host "  Frontend: Modern HTML5 / CSS3 + WebGL 3D Studio" -ForegroundColor Cyan
Write-Host "  Backend:  Node.js REST API with 50 Products" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

if (Get-Command node -ErrorAction SilentlyContinue) {
    Write-Host "[OK] Node.js is detected." -ForegroundColor Green
    if (-not (Test-Path "node_modules")) {
        Write-Host "[INFO] Checking packages..." -ForegroundColor Yellow
        npm install --prefer-offline --no-audit 2>$null
    }
    Write-Host ""
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host "  🚀 Launching Zovira at http://localhost:5000" -ForegroundColor Green
    Write-Host "  Opening default browser..." -ForegroundColor Cyan
    Write-Host "========================================================" -ForegroundColor Cyan
    Write-Host ""

    # Open browser after short delay
    Start-Job -ScriptBlock { Start-Sleep -Seconds 2; Start-Process "http://localhost:5000" } | Out-Null
    node server.js
    Exit 0
}

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Python detected. Starting local server..." -ForegroundColor Green
    Start-Job -ScriptBlock { Start-Sleep -Seconds 1; Start-Process "http://localhost:5000/public/index.html" } | Out-Null
    python -m http.server 5000
    Exit 0
}

Write-Host "[INFO] Opening Zovira Storefront directly in browser..." -ForegroundColor Yellow
Start-Process "public\index.html"
