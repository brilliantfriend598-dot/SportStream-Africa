import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMatchDetails } from '@/src/hooks/useMatchDetails';

export default function MatchDetailsScreen() {
  const params = useLocalSearchParams();
  const matchId = Number(params.id);
  const { data, loading, error } = useMatchDetails(matchId);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A' }}>
        <ActivityIndicator size="large" color="#F4C430" />
        <Text style={{ color: '#A3A3A3', marginTop: 16 }}>Loading match details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A0A0A', padding: 20 }}>
        <Text style={{ color: '#F4C430', fontSize: 18, marginBottom: 16 }}>Failed to load match</Text>
        <Text style={{ color: '#A3A3A3', textAlign: 'center' }}>{error ?? 'Match not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0A0A0A' }} contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ color: '#A3A3A3', fontSize: 12 }}>{data.league}</Text>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '700' }}>
        {data.home} {data.score} {data.away}
      </Text>
      <Text style={{ color: '#F4C430', fontWeight: '600' }}>{data.status}</Text>

      {data.venue ? (
        <Text style={{ color: '#A3A3A3' }}>Venue: {data.venue}</Text>
      ) : null}

      <View style={{ gap: 10 }}>
        <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>Stats</Text>
        {data.stats.map((item) => (
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
        {data.events.map((event, index) => (
          <View
            key={`${event.time}-${index}`}
            style={{
              backgroundColor: '#121212',
              borderRadius: 16,
              padding: 14,
            }}
          >
            <Text style={{ color: '#F4C430', fontWeight: '600' }}>{event.time}</Text>
            <Text style={{ color: '#fff', marginTop: 4 }}>{event.detail}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
