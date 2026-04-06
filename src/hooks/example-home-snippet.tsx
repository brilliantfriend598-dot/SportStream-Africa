import React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useTodayMatches } from '@/hooks/useTodayMatches';

export function HomeMatchesExample() {
  const { data, loading, error, refetch } = useTodayMatches();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ gap: 12 }}>
      {data.map((match) => (
        <Pressable key={match.id} style={{ padding: 16, borderRadius: 20, backgroundColor: '#121212' }}>
          <Text style={{ color: '#A3A3A3' }}>{match.league}</Text>
          <Text style={{ color: '#fff', fontSize: 18 }}>{match.home} vs {match.away}</Text>
          <Text style={{ color: '#F4C430' }}>{match.score} • {match.status}</Text>
          <Text style={{ color: '#A3A3A3' }}>{match.time}</Text>
        </Pressable>
      ))}
      <Pressable onPress={refetch}>
        <Text style={{ color: '#F4C430' }}>Refresh</Text>
      </Pressable>
    </View>
  );
}
