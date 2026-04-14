@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
cls

set PATH=C:\Program Files\nodejs;%PATH%
set NODE_OPTIONS=--max-old-space-size=8192

echo.
echo ==============================================================
echo   SPORTSTREAM AFRICA - MOBILE DEVELOPMENT SERVER
echo ==============================================================
echo.
echo Scan the QR code from your Android device once Expo starts.
echo 1. Open Expo Go on your phone
echo 2. Scan the QR code shown below
echo 3. The app will load on the same Wi-Fi network
echo.
echo If the QR code does not appear, make sure your device and
echo computer are connected to the same Wi-Fi network.
echo.

call npm run web

pause
