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

Once the app is running, open the new `Testing` shortcut from Home to confirm build mode, auth mode, and data-source health before sharing the build with testers.

## Environment variables

This project reads:

- `EXPO_PUBLIC_FOOTBALL_API_BASE_URL`
- `EXPO_PUBLIC_FOOTBALL_API_KEY`
- `EXPO_PUBLIC_API_PROXY_URL`
- `EXPO_PUBLIC_FOOTBALL_DATA_PROVIDER`
- `EXPO_PUBLIC_AUTH_PROVIDER`
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_DEFAULT_SEASON`
- `EXPO_PUBLIC_DEFAULT_TIMEZONE`
- `FOOTBALL_API_BASE_URL`
- `FOOTBALL_API_KEY`

If the API is unavailable or the credentials are missing, the app falls back to mock match and standings data so the UI still renders.
The local proxy also exposes `/health` so you can verify that your phone can reach it over Wi-Fi.

## Football provider switch

The football data layer is provider-swappable through `src/services/`.

- `EXPO_PUBLIC_FOOTBALL_DATA_PROVIDER=mock` uses sample football data by default.
- `EXPO_PUBLIC_FOOTBALL_DATA_PROVIDER=live` enables the live football provider.

The current hooks that use this provider layer are:

- `useTodayMatches`
- `useMatchDetails`
- `useStandings`

When `live` is enabled, the hooks still fall back to sample data if the API returns nothing or the request fails, so the existing UI keeps rendering safely.

## Auth provider switch

The auth layer now follows the same provider pattern as football data:

- `EXPO_PUBLIC_AUTH_PROVIDER=mock` keeps login in demo mode
- `EXPO_PUBLIC_AUTH_PROVIDER=firebase` enables real Firebase email/password auth

To enable Firebase auth:

1. Turn on Email/Password in your Firebase Authentication dashboard.
2. Add your Firebase Web API key to `.env` as `EXPO_PUBLIC_FIREBASE_API_KEY=...`.
3. Set `EXPO_PUBLIC_AUTH_PROVIDER=firebase`.
4. Restart Expo or rebuild the app.

Sessions now persist across app restarts on installed device builds, and the web build uses browser storage during local development.

Mock mode still works without Firebase setup and uses:

- email: `demo@sportstream.africa`
- password: `password123`

## Security note

Do not commit a real API key to the repo. `EXPO_PUBLIC_*` values are bundled into the client app, so production-safe API access should move behind your own backend, serverless function, or the included local proxy pattern.

## Hosted backend

This repo now includes a deployable serverless proxy:

- Local entry: [proxy-server.js](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/proxy-server.js)
- Shared proxy logic: [backend/proxy-core.js](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/backend/proxy-core.js)
- Hosted function entry: [api/index.js](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/api/index.js)
- Vercel config: [vercel.json](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/vercel.json)

Recommended deployment path:

1. Install Vercel CLI with `npm install -g vercel`.
2. Run `vercel` from the project root and link the project.
3. In Vercel project settings, add:
`FOOTBALL_API_BASE_URL=https://v3.football.api-sports.io`
`FOOTBALL_API_KEY=your-real-server-side-key`
4. Deploy to production with `vercel --prod`.
5. Set `EXPO_PUBLIC_API_PROXY_URL=https://your-project.vercel.app`.
6. Rebuild the app with the `preview` profile so the APK points at the hosted backend.

The hosted proxy exposes the same endpoints as local development, including `/health`.
There is also a step-by-step guide in [HOSTED_BACKEND_SETUP.md](C:/Users/Botsh/Downloads/sportstream-africa-expo-starter/sportstream-africa-expo-starter/HOSTED_BACKEND_SETUP.md).

## Next steps

- Move API requests behind a backend proxy
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
- After installing a `development` build, start Metro with `npm run dev-client` before opening the app on your phone.
- The `preview` profile creates a simple internal APK without the dev client and is the right choice when you want a standalone tester build.
- The `production` profile is configured for an Android App Bundle when you reach store-release prep.
- Android cleartext traffic is enabled in `app.json` so development builds can reach a local `http://` proxy on your Wi-Fi network.
- Placeholder app icon and splash assets are included under `assets/` so builds no longer fall back to generic defaults.

## Which build to use

- Use `development` when you want a true dev-client workflow with live Metro reloads.
- Use `preview` when you want an APK that opens by itself on the phone without running Metro.

Common commands:

```bash
npx eas build --platform android --profile development
npm run dev-client
```

```bash
npx eas build --platform android --profile preview
```
