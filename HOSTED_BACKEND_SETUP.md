# Hosted Backend Setup

Use this guide when you want the Android APK to work away from your local Wi-Fi network.

## 1. Deploy the proxy

Install the Vercel CLI:

```bash
npm install -g vercel
```

From the project root, run:

```bash
vercel
```

When prompted:

- Link to your Vercel account
- Create a new project if needed
- Keep the project root as the current folder

## 2. Add Vercel environment variables

In the Vercel dashboard, open your project and set:

- `FOOTBALL_API_BASE_URL=https://v3.football.api-sports.io`
- `FOOTBALL_API_KEY=your-real-api-football-key`

Then deploy to production:

```bash
vercel --prod
```

## 3. Test the hosted proxy

If your production URL is:

```text
https://sportstream-africa-proxy.vercel.app
```

Open this in a browser:

```text
https://sportstream-africa-proxy.vercel.app/health
```

You should get a JSON response with `ok: true`.

## 4. Update the app env for hosted builds

Set your app `.env` like this before rebuilding the APK:

```env
EXPO_PUBLIC_FOOTBALL_API_BASE_URL=https://v3.football.api-sports.io
EXPO_PUBLIC_FOOTBALL_API_KEY=
EXPO_PUBLIC_API_PROXY_URL=https://your-project.vercel.app
EXPO_PUBLIC_DEFAULT_SEASON=2025
EXPO_PUBLIC_DEFAULT_TIMEZONE=Africa/Johannesburg
FOOTBALL_API_BASE_URL=https://v3.football.api-sports.io
FOOTBALL_API_KEY=your-real-api-football-key
```

Notes:

- `EXPO_PUBLIC_FOOTBALL_API_KEY` should stay empty when the app uses the hosted proxy.
- `FOOTBALL_API_KEY` is for local/server use only and should never be committed.

## 5. Rebuild the standalone APK

```bash
npx eas build --platform android --profile preview
```

Install the new APK on your phone. It should now work without your laptop running the proxy.
