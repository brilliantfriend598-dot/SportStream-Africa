import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/src/context/AuthContext';
import { theme } from '../constants/theme';
import { SpeedInsights } from '@vercel/speed-insights/react';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="match/[id]"
          options={{
            contentStyle: { backgroundColor: theme.colors.bg },
          }}
        />
      </Stack>
      <SpeedInsights />
    </AuthProvider>
  );
}
