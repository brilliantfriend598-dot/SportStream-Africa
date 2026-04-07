# SportStream Africa - Mobile Testing Guide

## Option 1: Expo Go (Recommended for Testing)

### Prerequisites:
1. **Install Expo Go app** on your Android device:
   - Download from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

### Steps to Test:
1. **Start the development server:**
   ```bash
   npm run web
   ```

2. **On your Android device:**
   - Open Expo Go app
   - Scan the QR code shown in terminal
   - Your app will load instantly!

## Option 2: Development Build APK

### Prerequisites:
1. **Expo Account:** Sign up at [expo.dev](https://expo.dev)
2. **EAS CLI:** Install globally
   ```bash
   npm install -g eas-cli
   ```

### Build Steps:
1. **Login to Expo:**
   ```bash
   npx expo login
   ```

2. **Configure EAS:**
   ```bash
   npx eas build:configure
   ```

3. **Build development APK:**
   ```bash
   npx eas build --platform android --profile development
   ```

4. **Download and install** the APK from the build link

## Option 3: Production Build

For a production-ready APK:

```bash
npx eas build --platform android --profile production
```

## Current App Features:
- ✅ Dark theme football app
- ✅ Tab navigation (Home, Fixtures, News, Watch, Profile)
- ✅ Match details with stats and timeline
- ✅ API integration with football data
- ✅ Responsive design

## Troubleshooting:
- If QR code doesn't work, ensure both device and computer are on same WiFi
- For build issues, check [Expo documentation](https://docs.expo.dev/)
- Make sure Node.js and npm are properly installed

Would you like me to help you set up any of these options?