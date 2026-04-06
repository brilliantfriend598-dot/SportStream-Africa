import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { matches } from '@/data/mockData';
import { MatchCard } from '@/components/MatchCard';

export default function FixturesScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
            Fixtures
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 6 }}>
            Today’s schedule
          </Text>
        </View>
        <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="chevron-back" size={28} color={theme.colors.text} />
        </Pressable>
      </View>

      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </ScrollView>
  );
}
