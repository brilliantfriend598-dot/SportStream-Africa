# SportStream Africa Expo Starter

This is an Expo Router starter for the SportStream Africa mobile app.

## What is included

- Home, Fixtures, News, Watch, and Profile tabs
- Match details screen
- Reusable UI cards
- Live football API integration with mock-data fallback
- Dark green and gold SportStream Africa theme

## Quick start

1. Install Node.js 20+.
2. Copy `.env.example` to `.env`.
3. For direct client access, set `EXPO_PUBLIC_FOOTBALL_API_KEY`.
4. For safer local development, leave `EXPO_PUBLIC_FOOTBALL_API_KEY` empty, set `FOOTBALL_API_KEY`, and set `EXPO_PUBLIC_API_PROXY_URL`.
5. Install dependencies with `npm install`.
6. If you are using the local proxy, run `npm run proxy` in a second terminal.
7. Start the app with `npx expo start`.
8. For physical phone testing, set `EXPO_PUBLIC_API_PROXY_URL` to the LAN URL printed by the proxy, not `localhost`.

## Environment variables

This project reads:

- `EXPO_PUBLIC_FOOTBALL_API_BASE_URL`
- `EXPO_PUBLIC_FOOTBALL_API_KEY`
- `EXPO_PUBLIC_API_PROXY_URL`
- `EXPO_PUBLIC_DEFAULT_SEASON`
- `EXPO_PUBLIC_DEFAULT_TIMEZONE`
- `FOOTBALL_API_BASE_URL`
- `FOOTBALL_API_KEY`

If the API is unavailable or the credentials are missing, the app falls back to mock match and standings data so the UI still renders.
The local proxy also exposes `/health` so you can verify that your phone can reach it over Wi-Fi.

## Security note

Do not commit a real API key to the repo. `EXPO_PUBLIC_*` values are bundled into the client app, so production-safe API access should move behind your own backend, serverless function, or the included local proxy pattern.

## Next steps

- Move API requests behind a backend proxy
- Connect Firebase auth
- Add push notifications
- Replace placeholder visuals with real logos and thumbnails

## Android development build

1. Install EAS CLI with `npm install -g eas-cli`.
2. Log in with `npx expo login`.
3. Run `npx eas build:configure` if Expo asks to link the project.
4. Start a device-ready Android build with `npx eas build --platform android --profile development`.
5. Install the generated APK on your phone for testing outside Expo Go.

Notes:
- The `development` profile creates an internal APK with the Expo development client enabled.
- The `preview` profile creates a simple internal APK without the dev client.
- The `production` profile is configured for an Android App Bundle when you reach store-release prep.
- Android cleartext traffic is enabled in `app.json` so development builds can reach a local `http://` proxy on your Wi-Fi network.
- Placeholder app icon and splash assets are included under `assets/` so builds no longer fall back to generic defaults.
