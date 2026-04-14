import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '../constants/theme';

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
