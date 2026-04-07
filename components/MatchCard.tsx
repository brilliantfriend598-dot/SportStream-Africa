import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { theme } from '@/constants/theme';
import { BadgePill } from '@/components/BadgePill';

type MatchData = {
  id: string | number;
  league: string;
  home: string;
  away: string;
  time: string;
  status: 'LIVE' | 'UPCOMING' | 'FT' | string;
  score: string;
  events?: string[];
  stats?: { label: string; value: string }[];
};

type Props = {
  match: MatchData;
};

export function MatchCard({ match }: Props) {
  const statusColor =
    match.status === 'LIVE' ? theme.colors.gold : match.status === 'FT' ? '#C4C4C4' : '#8BE4BF';

  return (
    <Pressable
      onPress={() => router.push(`/match/${match.id}`)}
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.xl,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
          {match.league}
        </Text>
        <BadgePill label={match.status} color={statusColor} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '700' }}>{match.home}</Text>
          <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '700', marginTop: 10 }}>{match.away}</Text>
        </View>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800' }}>{match.score}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12, marginTop: 4 }}>{match.time}</Text>
        </View>
      </View>
    </Pressable>
  );
}
