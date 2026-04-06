import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { matches } from '@/data/mockData';

export default function MatchDetailsScreen() {
  const params = useLocalSearchParams();
  const matchId = params.id ? String(params.id) : '';
  const match = matches.find((item) => item.id === matchId);

  if (!match) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0A0A0A',
          padding: 20,
        }}
      >
        <Text style={{ color: '#F4C430' }}>No match found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#0A0A0A' }}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      <Text style={{ color: '#A3A3A3', fontSize: 12 }}>{match.league}</Text>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>
        {match.home} {match.score} {match.away}
      </Text>
      <Text style={{ color: '#F4C430', fontWeight: '600' }}>{match.status}</Text>

      <View style={{ gap: 10 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Stats</Text>
        {match.stats.map((item) => (
          <View
            key={item.label}
            style={{
              backgroundColor: '#121212',
              borderRadius: 16,
              padding: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ color: '#A3A3A3' }}>{item.label}</Text>
            <Text style={{ color: '#fff', fontWeight: '600' }}>{item.value}</Text>
          </View>
        ))}
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Timeline</Text>
        {match.events.map((event, index) => (
          <View
            key={`${event}-${index}`}
            style={{
              backgroundColor: '#121212',
              borderRadius: 16,
              padding: 14,
            }}
          >
            <Text style={{ color: '#F4C430', fontWeight: '600' }}>{event}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
