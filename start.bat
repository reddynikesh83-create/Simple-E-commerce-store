@echo off
title Zovira 3D E-Commerce Store
echo ========================================================
echo   💎 Starting Zovira Next-Gen 3D E-Commerce Store
echo   Frontend: Modern HTML5/CSS3 + WebGL 3D Studio
echo   Backend:  Node.js REST API with 50 Products
echo ========================================================
echo.

cd /d "%~dp0"

:: 1. Check for Node.js
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Node.js is detected.
    if not exist node_modules (
        echo [INFO] First time run: checking packages...
        call npm install --prefer-offline --no-audit >nul 2>&1
    )
    echo.
    echo ========================================================
    echo   🚀 Launching Zovira at http://localhost:5000
    echo   Opening your default browser...
    echo ========================================================
    echo.
    :: Wait 1.5s for port to bind, then open browser
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000"
    node server.js
    pause
    exit /b 0
)

:: 2. Fallback to Python if Node is not found
where python >nul 2>&1
if %errorlevel% equ 0 (
    echo [INFO] Python detected. Starting local server...
    start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5000/public/index.html"
    python -m http.server 5000
    pause
    exit /b 0
)

:: 3. Direct browser opening if neither is found (works 100% with full 50 products!)
echo [INFO] Opening Zovira Storefront directly in your browser...
start "" "public\index.html"
echo.
echo Storefront opened in default web browser.
pause
