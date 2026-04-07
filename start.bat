@echo off
cd /d "%~dp0"
set NODE_PATH=%CD%\node_modules
set PATH=C:\Program Files\nodejs;%PATH%

echo.
echo ========================================
echo SportStream Africa - Development Server
echo ========================================
echo.
echo Installing dependencies...
call npm install --legacy-peer-deps

echo.
echo Starting development server...
call npm run web

pause
