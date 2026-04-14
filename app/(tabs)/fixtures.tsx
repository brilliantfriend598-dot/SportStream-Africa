import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { theme } from '../../constants/theme';
import { MatchCard } from '../../components/MatchCard';
import { useTodayMatches } from '../../src/hooks/useTodayMatches';

export default function FixturesScreen() {
  const { data, loading, error, refetch } = useTodayMatches();

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
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 24 }}>
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
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          Today's schedule
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 4 }}>{data.length} matches found</Text>
      </View>

      {data.length === 0 ? (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Text style={{ color: theme.colors.muted, fontSize: 16 }}>No matches scheduled for today</Text>
        </View>
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
