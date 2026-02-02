@echo off
echo ========================================
echo   HEARTOPIANO SONGS - Deployment Script
echo ========================================
echo.

REM Check if songs folder exists
if not exist "songs" (
    echo ERROR: songs folder not found!
    echo Please make sure you have songs folder with .json files
    pause
    exit /b 1
)

REM Create temporary directory for songs repo
echo [1/6] Creating temporary directory...
if exist "temp-songs-repo" rmdir /s /q "temp-songs-repo"
mkdir temp-songs-repo
cd temp-songs-repo

echo.
echo [2/6] Initializing Git...
git init

echo.
echo [3/6] Copying songs...
mkdir songs
xcopy /E /I /Y "..\songs\*.json" "songs\"

echo.
echo [4/6] Creating README...
(
echo # HEARTOPIANO Songs Library
echo.
echo This repository contains song files for HEARTOPIANO app.
echo.
echo ## Song Format
echo.
echo ```json
echo {
echo   "id": "unique-id",
echo   "title": "Song Title",
echo   "artist": "Artist Name",
echo   "difficulty": "Easy/Medium/Hard",
echo   "bpm": 120,
echo   "notes": [
echo     { "key": "C", "beat": 0, "duration": 0.5 }
echo   ]
echo }
echo ```
echo.
echo ## Adding New Songs
echo.
echo 1. Create a .json file following the format above
echo 2. Place it in the `songs/` folder
echo 3. Commit and push
echo.
echo Songs will automatically appear in the app!
echo.
echo ---
echo Created by PUNN with ❤️
) > README.md

echo.
echo [5/6] Committing...
git add .
git commit -m "Initial commit - Song library"
git branch -M main

echo.
echo [6/6] Pushing to GitHub...
git remote add origin https://github.com/DDME36/heartopiano-songs.git
git push -u origin main --force

cd ..
rmdir /s /q "temp-songs-repo"

echo.
echo ========================================
echo   Songs Deployment Complete!
echo ========================================
echo.
echo Your songs are now at:
echo https://github.com/DDME36/heartopiano-songs
echo.
echo The app will automatically load songs from this repository!
echo.
pause
