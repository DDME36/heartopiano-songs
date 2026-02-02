@echo off
echo ========================================
echo   HEARTOPIANO - Deployment Script
echo ========================================
echo.

echo [1/5] Initializing Git...
git init
if errorlevel 1 (
    echo Git already initialized
)

echo.
echo [2/5] Adding all files...
git add .

echo.
echo [3/5] Committing changes...
git commit -m "Initial commit - HEARTOPIANO v1.0.0"

echo.
echo [4/5] Setting up remote...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/DDME36/heartopiano.git

echo.
echo [5/5] Pushing to GitHub...
git push -u origin main --force

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to: https://github.com/DDME36/heartopiano
echo 2. Create a new Release (tag: v1.0.0)
echo 3. Upload: dist/Heartopiano-Setup-1.0.0.exe
echo 4. Enable GitHub Pages in Settings
echo.
echo Your website will be at:
echo https://ddme36.github.io/heartopiano/
echo.
pause
