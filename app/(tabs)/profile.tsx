import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '@/src/context/AuthContext';
import { theme } from '../../constants/theme';
import { PreferenceRow } from '../../components/PreferenceRow';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, signOut, provider } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 16, paddingTop: 20 }}>
      <View
        style={{
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 20,
          flexDirection: 'row',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 24,
            backgroundColor: theme.colors.green,
            opacity: 0.85,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>
            {isAuthenticated ? user?.displayName || user?.email || 'Welcome back' : 'Welcome back'}
          </Text>
          <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 6 }}>
            {isAuthenticated
              ? `Signed in with ${provider}.`
              : isLoading
                ? 'Checking your account...'
                : 'Set your preferences and favorite clubs.'}
          </Text>
        </View>
      </View>

      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', marginTop: 24, marginBottom: 12 }}>
        Your Preferences
      </Text>

      <PreferenceRow label="Favorite Team" value="Mamelodi Sundowns" />
      <PreferenceRow label="Notifications" value="Enabled" />
      <PreferenceRow label="Preferred Leagues" value="EPL, UCL, PSL" />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 24 }}>
        <TouchableOpacity
          onPress={() => router.push('/login')}
          style={{
            flex: 1,
            backgroundColor: theme.colors.gold,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#111111', fontSize: 15, fontWeight: '800' }}>
            {isAuthenticated ? 'Manage Account' : 'Log In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            void signOut();
          }}
          disabled={!isAuthenticated}
          style={{
            flex: 1,
            backgroundColor: theme.colors.panel,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
            opacity: isAuthenticated ? 1 : 0.5,
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
