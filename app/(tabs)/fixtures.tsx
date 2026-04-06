import { ScrollView, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { matches } from '@/data/mockData';
import { MatchCard } from '@/components/MatchCard';

export default function FixturesScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ marginBottom: 24 }}>
        <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Fixtures
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 6 }}>
          Today’s schedule
        </Text>
      </View>

      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </ScrollView>
  );
}
