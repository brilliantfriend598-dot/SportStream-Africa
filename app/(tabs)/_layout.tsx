import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTodayMatches } from '@/src/hooks/useTodayMatches';

export default function HomeScreen() {
  const router = useRouter();
  const { data, loading, error, refetch } = useTodayMatches();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0A0A0A' }} contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>Today’s Matches</Text>

      {error ? (
        <Text style={{ color: '#F4C430' }}>{error}</Text>
      ) : null}

      {data.map((match) => (
        <Pressable
          key={match.id}
          onPress={() =>
            router.push({
              pathname: '/match/[id]',
              params: { id: String(match.id) },
            })
          }
          style={{
            backgroundColor: '#121212',
            borderRadius: 20,
            padding: 16,
            gap: 8,
          }}
        >
          <Text style={{ color: '#A3A3A3', fontSize: 12 }}>{match.league}</Text>
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>
            {match.home} vs {match.away}
          </Text>
          <Text style={{ color: '#F4C430', fontWeight: '600' }}>
            {match.score} • {match.status}
          </Text>
          <Text style={{ color: '#A3A3A3' }}>{match.time}</Text>
        </Pressable>
      ))}

      <Pressable onPress={refetch} style={{ paddingVertical: 12 }}>
        <Text style={{ color: '#F4C430', fontWeight: '600' }}>Refresh</Text>
      </Pressable>
    </ScrollView>
  );
}