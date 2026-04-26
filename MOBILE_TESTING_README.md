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
6. Start Metro with `npm run dev-client`.
7. Open the app on your phone while your computer and phone are on the same Wi-Fi network.

Profile notes:
- `development`: internal APK with Expo development client support and requires Metro
- `preview`: internal APK for broader tester installs and does not require Metro after install
- `production`: app bundle for store-ready release work

## Notes

- Use Expo Go for the fastest testing loop.
- Use the proxy when you do not want to expose the API key to the client bundle.
- For login testing, keep `EXPO_PUBLIC_AUTH_PROVIDER=mock` unless you have already enabled Firebase Email/Password auth and set `EXPO_PUBLIC_FIREBASE_API_KEY`.
- Use the `Testing` shortcut on the Home screen to verify app version, auth provider, API transport, and data-source status directly on the phone.
- On a physical phone, do not use `localhost` for `EXPO_PUBLIC_API_PROXY_URL`; use the LAN IP printed by `npm run proxy`.
- Android development builds in this project allow `http://` LAN proxy traffic, so you can test against your local machine without HTTPS during development.
- Placeholder icon and splash assets are already configured, so the installed APK should look branded instead of generic.
- For production, move API access behind your own backend or serverless function.

## Hosted backend path

If you want the APK to work away from your local Wi-Fi:

1. Deploy the included serverless proxy with Vercel.
2. Set `FOOTBALL_API_KEY` and `FOOTBALL_API_BASE_URL` as Vercel environment variables.
3. Change `.env` so `EXPO_PUBLIC_API_PROXY_URL` points at your hosted URL with the API prefix, such as `https://your-project.vercel.app/api/football`.
4. Rebuild with `npx eas build --platform android --profile preview`.

Use [HOSTED_BACKEND_SETUP.md](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/HOSTED_BACKEND_SETUP.md) and [.env.hosted.example](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/.env.hosted.example) as the deployment template.
