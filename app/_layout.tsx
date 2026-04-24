import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { AuthProvider } from '@/src/context/AuthContext';
import { theme } from '../constants/theme';
import { Analytics } from '@vercel/analytics/react';

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
      {Platform.OS === 'web' && <Analytics />}
    </AuthProvider>
  );
}
