import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import { useAuth } from '../../src/context/AuthContext';
import { LEAGUES } from '../../src/constants/leagues';
import { useStandings } from '../../src/hooks/useStandings';
import { useTodayMatches } from '../../src/hooks/useTodayMatches';
import { apiConfig } from '../../src/lib/api/config';
import { getFootballDataProvider } from '../../src/services/footballApi';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
const APP_NAME = Constants.expoConfig?.name ?? 'SportStream Africa';

export default function TestingScreen() {
  const router = useRouter();
  const { provider: authProvider, user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: matches, notice: matchesNotice, source: matchesSource, refetch: refetchMatches } = useTodayMatches();
  const {
    data: standings,
    notice: standingsNotice,
    source: standingsSource,
    refetch: refetchStandings,
  } = useStandings(LEAGUES.PSL);

  const footballProvider = getFootballDataProvider();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
        Real-World Testing
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800', marginTop: 6 }}>
        Testing Hub
      </Text>
      <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 8, lineHeight: 20 }}>
        One place to confirm what this build is using before you hand it to a real tester.
      </Text>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 16,
        }}
      >
        <StatusRow
          icon="phone-portrait"
          label="App"
          value={`${APP_NAME} v${APP_VERSION}`}
          detail={`${Platform.OS} build`}
        />
        <StatusRow
          icon="server"
          label="Football provider"
          value={footballProvider === 'live' ? 'Live API mode' : 'Mock data mode'}
          detail={apiConfig.usingProxy ? 'Hosted/local proxy enabled' : 'Direct API mode'}
        />
        <StatusRow
          icon="shield-checkmark"
          label="Auth provider"
          value={authProvider === 'firebase' ? 'Firebase auth' : 'Demo auth'}
          detail={
            authLoading
              ? 'Checking stored session'
              : isAuthenticated
                ? user?.email ?? 'Signed in'
                : 'No active session'
          }
        />
      </View>

      <SectionHeader title="Live Data Health" action="Refresh checks" onPress={() => {
        refetchMatches();
        refetchStandings();
      }} />

      <View style={{ gap: 12 }}>
        <HealthCard
          title="Today matches"
          source={matchesSource}
          summary={`${matches.length} matches loaded`}
          notice={matchesNotice}
        />
        <HealthCard
          title="PSL standings"
          source={standingsSource}
          summary={`${standings.length} table rows loaded`}
          notice={standingsNotice}
        />
      </View>

      <SectionHeader title="Environment" />
      <View
        style={{
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 12,
        }}
      >
        <InfoRow label="API transport" value={apiConfig.usingProxy ? 'Proxy' : 'Direct'} />
        <InfoRow label="Base URL" value={apiConfig.baseUrl || 'Not configured'} />
        <InfoRow label="Season" value={String(apiConfig.defaultSeason)} />
        <InfoRow label="Timezone" value={apiConfig.defaultTimezone} />
        <InfoRow label="Stored auth" value={isAuthenticated ? 'Session restored' : 'No saved session'} />
      </View>

      <SectionHeader title="Tester Checklist" />
      <View
        style={{
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 12,
        }}
      >
        {[
          'Open Home and confirm the source badge matches the expected data mode.',
          'Pull to refresh on Home and Fixtures to confirm the app stays responsive.',
          'Open Match Details from a fixture and confirm the screen loads without errors.',
          'Sign in, fully close the app, then reopen it to verify session persistence.',
          'Switch off Wi-Fi once to confirm fallback notices are understandable.',
        ].map((item) => (
          <ChecklistItem key={item} label={item} />
        ))}
      </View>

      <SectionHeader title="Tester Actions" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        <ActionCard
          icon="mail-open"
          title="Send Feedback"
          description="Open a feedback email draft for testers."
          onPress={() =>
            Linking.openURL(
              'mailto:support@sportstream.africa?subject=SportStream%20Africa%20Test%20Feedback',
            )
          }
        />
        <ActionCard
          icon="person-circle"
          title="Check Login"
          description="Open the sign-in flow quickly."
          onPress={() => router.push('/login')}
          actionLabel="Open screen"
        />
        <ActionCard
          icon="football"
          title="Open Fixtures"
          description="Jump to the live match list."
          onPress={() => router.push('/fixtures')}
          actionLabel="Open screen"
        />
      </View>
    </ScrollView>
  );
}

function StatusRow({
  icon,
  label,
  value,
  detail,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 16,
          backgroundColor: '#1B1B1B',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.gold} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
        <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700', marginTop: 2 }}>{value}</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 4 }}>{detail}</Text>
      </View>
    </View>
  );
}

function HealthCard({
  title,
  source,
  summary,
  notice,
}: {
  title: string;
  source: 'live' | 'sample';
  summary: string;
  notice: string | null;
}) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 24,
        padding: 18,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700', flex: 1 }}>{title}</Text>
        <DataSourceBadge source={source} />
      </View>
      <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 12 }}>{summary}</Text>
      {notice ? (
        <View
          style={{
            marginTop: 12,
            backgroundColor: '#1A1607',
            borderColor: theme.colors.gold,
            borderWidth: 1,
            borderRadius: 16,
            padding: 12,
          }}
        >
          <Text style={{ color: theme.colors.gold, fontSize: 12, lineHeight: 18 }}>{notice}</Text>
        </View>
      ) : null}
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: theme.colors.border,
        paddingTop: 12,
      }}
    >
      <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 14, marginTop: 4 }}>{value}</Text>
    </View>
  );
}

function ChecklistItem({ label }: { label: string }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <Ionicons name="checkmark-circle" size={18} color={theme.colors.gold} style={{ marginTop: 1 }} />
      <Text style={{ color: theme.colors.text, fontSize: 14, lineHeight: 20, flex: 1 }}>{label}</Text>
    </View>
  );
}

function ActionCard({
  icon,
  title,
  description,
  onPress,
  actionLabel = 'Open action',
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
  actionLabel?: string;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: '48%',
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        gap: 10,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 14,
          backgroundColor: '#1B1B1B',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.gold} />
      </View>
      <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>{description}</Text>
      <Text style={{ color: theme.colors.gold, fontSize: 12, fontWeight: '700' }}>{actionLabel}</Text>
    </TouchableOpacity>
  );
}
