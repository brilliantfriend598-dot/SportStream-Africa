import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useMatchDetails } from '@/hooks/useMatchDetails';

export function MatchDetailsExample({ matchId }: { matchId: number }) {
  const { data, loading, error } = useMatchDetails(matchId);

  if (loading) return <ActivityIndicator />;
  if (error || !data) return <Text>{error ?? 'No match found'}</Text>;

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: '#fff', fontSize: 24 }}>{data.home} {data.score} {data.away}</Text>
      <Text style={{ color: '#A3A3A3' }}>{data.league} • {data.status}</Text>

      <View style={{ gap: 8 }}>
        {data.stats.map((item) => (
          <Text key={item.label} style={{ color: '#fff' }}>{item.label}: {item.value}</Text>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        {data.events.map((event, index) => (
          <Text key={`${event.time}-${index}`} style={{ color: '#F4C430' }}>
            {event.time} {event.detail}
          </Text>
        ))}
      </View>
    </View>
  );
}
