@echo off
chcp 65001 >nul
cls
echo ╔════════════════════════════════════════╗
echo ║     HEARTOPIANO - Build Script         ║
echo ╚════════════════════════════════════════╝
echo.

REM Check if python-embed exists
if not exist "python-embed\python.exe" (
    echo [Step 1/5] Setting up Python Embedded...
    echo.
    
    if not exist "python-embed" mkdir python-embed
    cd python-embed
    
    echo Downloading Python...
    powershell -Command "Invoke-WebRequest -Uri 'https://www.python.org/ftp/python/3.11.9/python-3.11.9-embed-amd64.zip' -OutFile 'python.zip'"
    
    echo Extracting...
    powershell -Command "Expand-Archive -Path 'python.zip' -DestinationPath '.' -Force"
    del python.zip
    
    echo Downloading pip...
    powershell -Command "Invoke-WebRequest -Uri 'https://bootstrap.pypa.io/get-pip.py' -OutFile 'get-pip.py'"
    
    REM Enable pip by uncommenting import site
    powershell -Command "(Get-Content 'python311._pth') -replace '#import site', 'import site' | Set-Content 'python311._pth'"
    
    echo Installing pip...
    python.exe get-pip.py --no-warn-script-location
    
    echo Installing packages...
    python.exe -m pip install pydirectinput pygetwindow --no-warn-script-location
    
    cd ..
    echo ✓ Python setup complete!
    echo.
) else (
    echo [Step 1/5] Python already set up ✓
    echo.
)

echo [Step 2/5] Building app...
call npm run electron:build

if errorlevel 1 (
    echo.
    echo ╔════════════════════════════════════════╗
    echo ║  ERROR: Build failed!                  ║
    echo ╚════════════════════════════════════════╝
    echo.
    echo This might be due to Windows permissions.
    echo.
    echo Solutions:
    echo 1. Run this script as Administrator
    echo 2. OR Enable Developer Mode:
    echo    - Windows Settings ^> Privacy ^& Security
    echo    - For developers ^> Developer Mode ON
    echo    - Restart computer
    echo.
    pause
    exit /b 1
)

echo.
echo [Step 3/5] Checking output...
if exist "dist\Heartopiano-1.0.0-portable.exe" (
    echo ✓ Build successful!
    echo.
    echo File: dist\Heartopiano-1.0.0-portable.exe
    echo Size: 
    powershell -Command "(Get-Item 'dist\Heartopiano-1.0.0-portable.exe').Length / 1MB | ForEach-Object { '{0:N2} MB' -f $_ }"
) else (
    echo ✗ Build file not found!
    pause
    exit /b 1
)

echo.
echo [Step 4/5] Committing changes...
git add .
git commit -m "Build v1.0.0 - Ready for release"

echo.
echo [Step 5/5] Pushing to GitHub...
git push

echo.
echo ╔════════════════════════════════════════╗
echo ║  BUILD COMPLETE!                       ║
echo ╚════════════════════════════════════════╝
echo.
echo Next steps:
echo 1. Go to: https://github.com/DDME36/heartopiano-songs/releases/new
echo 2. Tag: v1.0.0
echo 3. Upload: dist\Heartopiano-1.0.0-portable.exe
echo 4. Publish release
echo.
echo 5. Enable GitHub Pages:
echo    Settings ^> Pages ^> main branch ^> Save
echo.
echo Your download page will be at:
echo https://ddme36.github.io/heartopiano-songs/
echo.
pause
