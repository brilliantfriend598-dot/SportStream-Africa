import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useStandings } from '@/src/hooks/useStandings';

export function StandingsExample({ leagueId }: { leagueId: number }) {
  const { data, loading, error, notice, source } = useStandings(leagueId);

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>{error}</Text>;

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: '#F4C430', fontWeight: '700' }}>
        {source === 'live' ? 'Live API' : 'Sample Data'}
      </Text>

      {notice ? <Text style={{ color: '#F4C430' }}>{notice}</Text> : null}

      {data.map((row) => (
        <View
          key={`${row.rank}-${row.team}`}
          style={{
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#121212',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: '#fff' }}>
            {row.rank}. {row.team}
          </Text>
          <Text style={{ color: '#A3A3A3' }}>{row.points} pts</Text>
        </View>
      ))}
    </View>
  );
}
