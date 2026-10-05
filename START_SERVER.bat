@echo off
title Zovira 3D E-Commerce Store - Startup
color 0A
echo.
echo  ============================================================
echo    ZOVIRA - Next-Gen 3D Interactive E-Commerce Store
echo    CodeAlpha Full Stack Internship Task 1
echo  ============================================================
echo.

:: Move to project directory
cd /d "%~dp0"

:: Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js not found!
  echo.
  echo  Please install Node.js from: https://nodejs.org
  echo  Download the LTS version and run the installer.
  echo.
  pause
  exit /b 1
)

echo  Node.js found: 
node --version
echo.

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules\" (
  echo  [1/2] Installing dependencies (express, cors)...
  npm install
  if %errorlevel% neq 0 (
    echo  [ERROR] npm install failed.
    pause
    exit /b 1
  )
  echo  Dependencies installed successfully!
  echo.
) else (
  echo  [1/2] Dependencies already installed. Skipping...
  echo.
)

echo  [2/2] Starting Zovira Backend Server...
echo.
echo  ============================================================
echo    Store Frontend:   http://localhost:5000
echo    REST API:         http://localhost:5000/api/products
echo    Health Check:     http://localhost:5000/api/health
echo  ============================================================
echo.
echo  Press Ctrl+C to stop the server.
echo.

node server.js
pause
