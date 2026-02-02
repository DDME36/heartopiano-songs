@echo off
chcp 65001 >nul
echo ========================================
echo   HEARTOPIANO - Complete Deployment
echo ========================================
echo.

REM Check if songs folder exists
if not exist "songs" (
    echo ERROR: songs folder not found!
    echo Please make sure you have songs folder with .json files
    pause
    exit /b 1
)

REM Check if songs folder has .json files
dir /b songs\*.json >nul 2>&1
if errorlevel 1 (
    echo ERROR: No .json files found in songs folder!
    pause
    exit /b 1
)

echo [1/7] Initializing Git...
git init
if errorlevel 1 (
    echo Git already initialized
)

echo.
echo [2/7] Adding all files...
git add .

echo.
echo [3/7] Committing changes...
git commit -m "HEARTOPIANO v1.0.0 - Complete package with songs"
if errorlevel 1 (
    echo Nothing to commit or already committed
)

echo.
echo [4/7] Setting up remote...
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/DDME36/heartopiano-songs.git

echo.
echo [5/7] Pushing to GitHub...
git push -u origin main --force

echo.
echo [6/7] Creating .gitattributes for better handling...
echo # Linguist overrides > .gitattributes
echo *.json linguist-detectable=false >> .gitattributes
echo *.md linguist-documentation >> .gitattributes
git add .gitattributes
git commit -m "Add .gitattributes"
git push

echo.
echo [7/7] Deployment complete!

echo.
echo ========================================
echo   SUCCESS! Next Steps:
echo ========================================
echo.
echo 1. Go to: https://github.com/DDME36/heartopiano-songs
echo.
echo 2. Create a new Release:
echo    - Click "Releases" tab
echo    - Click "Create a new release"
echo    - Tag: v1.0.0
echo    - Title: HEARTOPIANO v1.0.0
echo    - Upload: dist\Heartopiano-Setup-1.0.0.exe
echo    - Click "Publish release"
echo.
echo 3. Enable GitHub Pages:
echo    - Go to Settings ^> Pages
echo    - Source: main branch, / (root)
echo    - Save
echo.
echo 4. Your website will be at:
echo    https://ddme36.github.io/heartopiano-songs/
echo.
echo 5. Download link will be:
echo    https://github.com/DDME36/heartopiano-songs/releases/latest/download/Heartopiano-Setup-1.0.0.exe
echo.
pause
