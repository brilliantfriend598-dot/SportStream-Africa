@echo off
cd /d "%~dp0"
cls

echo.
echo ========================================
echo  SportStream Africa - Mobile Testing
echo ========================================
echo.

set PATH=C:\Program Files\nodejs;%PATH%
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_PATH=%CD%\node_modules

echo Starting Expo development server...
echo Please wait while the server initializes...
echo.

call npm run web

pause
