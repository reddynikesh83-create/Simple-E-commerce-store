Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting CodeAlpha Task 1: Simple E-Commerce Store" -ForegroundColor Cyan
Write-Host "  Frontend: HTML5 / CSS3 / JavaScript" -ForegroundColor Cyan
Write-Host "  Backend:  Django (Python) REST API" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

$pythonCmd = $null
if (Get-Command python -ErrorAction SilentlyContinue) {
    $pythonCmd = "python"
} elseif (Get-Command py -ErrorAction SilentlyContinue) {
    $pythonCmd = "py"
}

if (-not $pythonCmd) {
    Write-Host "[ERROR] Python is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Python from https://www.python.org/ and check 'Add Python to PATH'." -ForegroundColor Yellow
    Exit 1
}

Write-Host "[INFO] Python detected ($pythonCmd). Checking Django..." -ForegroundColor Green
$hasDjango = & $pythonCmd -c "import django" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[INFO] Installing dependencies (Django)..." -ForegroundColor Yellow
    & $pythonCmd -m pip install -r requirements.txt
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies!" -ForegroundColor Red
        Exit 1
    }
}

Write-Host "[INFO] Applying database migrations..." -ForegroundColor Green
& $pythonCmd manage.py migrate --noinput

Write-Host "[INFO] Seeding product catalog..." -ForegroundColor Green
& $pythonCmd manage.py seed_db

Write-Host ""
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  🚀 Launching Django Server at http://127.0.0.1:8000/" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

& $pythonCmd manage.py runserver 127.0.0.1:8000
