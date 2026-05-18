import { ActivityIndicator, RefreshControl, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { theme } from '../../constants/theme';
import { MatchCard } from '../../components/MatchCard';
import { useTodayMatches } from '../../src/hooks/useTodayMatches';

export default function FixturesScreen() {
  const { data, loading, error, notice, source, diagnostics, refetch } = useTodayMatches();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
        <Text style={{ color: theme.colors.text, marginTop: 16 }}>Loading fixtures...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg, padding: 20 }}
      >
        <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 16 }}>Failed to load fixtures</Text>
        <Text style={{ color: theme.colors.muted, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        <Text style={{ color: theme.colors.gold, fontWeight: '600' }} onPress={refetch}>
          Try again
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={theme.colors.gold} />
      }
    >
      <LinearGradient
        colors={[theme.colors.bgElevated, theme.colors.panel, theme.colors.panelSoft]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
          marginBottom: 22,
        }}
      >
        <Text
          style={{
            color: theme.colors.gold,
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          Fixtures
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
          Match radar
        </Text>
        <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
          Live scores, kick-off windows, and the current match feed across your tracked competitions.
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <HeroChip label="Matches" value={String(data.length)} />
          <HeroChip label="Mode" value={source === 'live' ? 'Live' : 'Sample'} />
        </View>
      </LinearGradient>

      <View style={{ marginBottom: 12 }}>
        <DataSourceBadge source={source} />
      </View>

      {notice ? <NoticeBanner text={notice} /> : null}

      {diagnostics.length ? (
        <View
          style={{
            backgroundColor: theme.colors.panel,
            borderColor: theme.colors.borderStrong,
            borderWidth: 1,
            borderRadius: 18,
            padding: 14,
            marginBottom: 16,
            gap: 8,
          }}
        >
          <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: '800' }}>Live request diagnostics</Text>
          {diagnostics.map((item) => (
            <Text key={`${item.leagueId}-${item.status}`} style={{ color: theme.colors.muted, fontSize: 12, lineHeight: 18 }}>
              League {item.leagueId}: {item.status === 'success' ? `${item.matchCount} match(es)` : item.message || 'Request failed'}
            </Text>
          ))}
        </View>
      ) : null}

      {data.length === 0 ? (
        <EmptyPanel label="No matches scheduled right now" />
      ) : (
        data.map((match) => (
          <MatchCard
            key={match.id}
            match={{
              id: String(match.id),
              league: match.league,
              home: match.home,
              away: match.away,
              time: match.time,
              status: match.status as 'LIVE' | 'UPCOMING' | 'FT',
              score: match.score,
              events: [],
              stats: [],
            }}
          />
        ))
      )}
    </ScrollView>
  );
}

function HeroChip({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panelWarm,
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
      }}
    >
      <Text style={{ color: theme.colors.muted, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>{label}</Text>
      <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function NoticeBanner({ text }: { text: string }) {
  return (
    <View
      style={{
        backgroundColor: '#1A1607',
        borderColor: theme.colors.gold,
        borderWidth: 1,
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
      }}
    >
      <Text style={{ color: theme.colors.gold, fontSize: 12, lineHeight: 18 }}>{text}</Text>
    </View>
  );
}

function EmptyPanel({ label }: { label: string }) {
  return (
    <View
      style={{
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 20,
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: 22,
      }}
    >
      <Text style={{ color: theme.colors.muted, fontSize: 15 }}>{label}</Text>
    </View>
  );
}
