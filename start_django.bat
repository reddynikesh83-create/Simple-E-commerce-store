@echo off
title CodeAlpha E-Commerce Store (Django Python Backend)
echo ========================================================
echo   Starting CodeAlpha Task 1: Simple E-Commerce Store
echo   Frontend: HTML5 / CSS3 / JavaScript
echo   Backend:  Django (Python) REST API
echo ========================================================
echo.

python --version >nul 2>&1
if %errorlevel% neq 0 (
    py --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo [ERROR] Python is not installed or not in your PATH!
        echo Please install Python 3.10+ from https://www.python.org/
        echo Make sure to check "Add Python to PATH" during installation.
        pause
        exit /b 1
    ) else (
        set PYCMD=py
    )
) else (
    set PYCMD=python
)

echo [INFO] Python detected. Checking Django installation...
%PYCMD% -c "import django" >nul 2>&1
if %errorlevel% neq 0 (
    echo [INFO] Installing required dependencies (Django)...
    %PYCMD% -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies via pip.
        pause
        exit /b 1
    )
)

echo.
echo [INFO] Running database migrations...
%PYCMD% manage.py migrate --noinput

echo.
echo [INFO] Seeding initial product catalog and reviews...
%PYCMD% manage.py seed_db

echo.
echo ========================================================
echo   🚀 Launching Django Server at http://127.0.0.1:8000/
echo   Open your browser to: http://127.0.0.1:8000/
echo ========================================================
echo.
%PYCMD% manage.py runserver 127.0.0.1:8000
pause
