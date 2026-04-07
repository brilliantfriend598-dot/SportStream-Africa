@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"
cls

set PATH=C:\Program Files\nodejs;%PATH%
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_PATH=%CD%\node_modules

echo.
echo ========================================
echo  SportStream Africa - Mobile QR Code
echo ========================================
echo.

REM Check if expo is installed locally
if not exist "node_modules\expo" (
  echo Installing Expo locally...
  call npm install expo@49.0.0 --save --legacy-peer-deps
)

echo.
echo Starting development server...
echo.
echo Once the server starts, a QR code will appear.
echo Scan it with Expo Go app on your phone!
echo.

setlocal
REM Use the local expo
set "NODE_PATH=%CD%\node_modules;%NODE_PATH%"
call npm run web 2>&1

pause
