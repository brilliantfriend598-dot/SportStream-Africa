@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"
cls

set PATH=C:\Program Files\nodejs;%PATH%
set NODE_OPTIONS=--max-old-space-size=8192

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  SPORTSTREAM AFRICA - MOBILE DEVELOPMENT SERVER              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Scanning QR code from your Android device...
echo Once the server starts:
echo  1. Open Expo Go app on your phone
echo  2. Scan the QR code shown below
echo  3. Your app will load instantly!
echo.
echo If QR code doesn't appear, ensure your device and computer   
echo are on the same WiFi network.
echo.
echo ──────────────────────────────────────────────────────────────
echo.

echo y | npx expo@49 start --web

pause
