# SportStream Africa Mobile Testing Guide

## Option 1: Expo Go

1. Install Expo Go on your Android device from the Google Play Store.
2. Run `npm run web` or use `run-dev-server.bat`.
3. Open Expo Go and scan the QR code shown in the terminal.

## Option 2: Safer local API proxy

1. Put your real API key in `.env` as `FOOTBALL_API_KEY`.
2. Set `EXPO_PUBLIC_API_PROXY_URL=http://YOUR_COMPUTER_IP:8787` in `.env`.
3. Start the proxy with `npm run proxy`.
4. Start Expo with `npm run web`.
5. Open `http://YOUR_COMPUTER_IP:8787/health` on your phone browser to confirm the device can reach the proxy.

This keeps the API key out of the mobile client during local development.

## Option 3: Development build APK

1. Install `eas-cli`.
2. Run `npx expo login`.
3. Run `npx eas build:configure`.
4. Run `npx eas build --platform android --profile development`.
5. Install the APK on your phone once the build finishes.

Profile notes:
- `development`: internal APK with Expo development client support
- `preview`: internal APK for broader tester installs
- `production`: app bundle for store-ready release work

## Notes

- Use Expo Go for the fastest testing loop.
- Use the proxy when you do not want to expose the API key to the client bundle.
- On a physical phone, do not use `localhost` for `EXPO_PUBLIC_API_PROXY_URL`; use the LAN IP printed by `npm run proxy`.
- Android development builds in this project allow `http://` LAN proxy traffic, so you can test against your local machine without HTTPS during development.
- For production, move API access behind your own backend or serverless function.
