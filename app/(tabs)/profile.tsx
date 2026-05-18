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
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
          borderRadius: 28,
          padding: 22,
          gap: 16,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
          <View
            style={{
              width: 68,
              height: 68,
              borderRadius: 24,
              backgroundColor: theme.colors.green,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: '900' }}>
              {isAuthenticated ? (user?.email?.[0] ?? 'S').toUpperCase() : 'S'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '900' }}>
              {isAuthenticated ? user?.displayName || user?.email || 'Welcome back' : 'Welcome back'}
            </Text>
            <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 6, lineHeight: 20 }}>
              {isAuthenticated
                ? `Signed in with ${provider}.`
                : isLoading
                  ? 'Checking your account...'
                  : 'Set your preferences, teams, and alerts for a more personal matchday feed.'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <ProfileStat label="Alerts" value="On" />
          <ProfileStat label="Leagues" value="3" />
          <ProfileStat label="Mode" value={isAuthenticated ? 'Saved' : 'Guest'} />
        </View>
      </View>

      <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: '800', marginTop: 28, marginBottom: 12 }}>
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
            borderColor: theme.colors.borderStrong,
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

function ProfileStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.bgElevated,
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ color: theme.colors.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '800', marginTop: 4 }}>{value}</Text>
    </View>
  );
}
