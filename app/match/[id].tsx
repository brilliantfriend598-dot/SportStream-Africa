import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { matches } from '@/data/mockData';
import { BadgePill } from '@/components/BadgePill';
import { SectionHeader } from '@/components/SectionHeader';

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const match = matches.find((item) => item.id === id) ?? matches[0];
  const statusColor =
    match.status === 'LIVE' ? theme.colors.gold : match.status === 'FT' ? '#C4C4C4' : '#8BE4BF';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: theme.colors.bg }}
        contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 }}
        >
          <Ionicons name="arrow-back" size={16} color={theme.colors.gold} />
          <Text style={{ color: theme.colors.gold, fontSize: 14, fontWeight: '600' }}>Back to matches</Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: theme.colors.panel,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 24,
            padding: 20,
          }}
        >
          <Text style={{ color: theme.colors.muted, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase' }}>
            {match.league}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 18 }}>
            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#1F1F1F' }} />
              <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: '700', marginTop: 10 }}>
                {match.home}
              </Text>
            </View>

            <View style={{ alignItems: 'center', paddingHorizontal: 12 }}>
              <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: '800' }}>{match.score}</Text>
              <View style={{ marginTop: 8 }}>
                <BadgePill label={match.status} color={statusColor} />
              </View>
            </View>

            <View style={{ alignItems: 'center', flex: 1 }}>
              <View style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: '#1F1F1F' }} />
              <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: '700', marginTop: 10 }}>
                {match.away}
              </Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Key Stats" action="Live feed" />
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {match.stats.map((stat) => (
            <View
              key={stat.label}
              style={{
                width: '48%',
                backgroundColor: theme.colors.panel,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 24,
                padding: 16,
              }}
            >
              <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{stat.label}</Text>
              <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 }}>
                {stat.value}
              </Text>
            </View>
          ))}
        </View>

        <SectionHeader title="Timeline" action="Full events" />
        {match.events.length ? (
          match.events.map((event) => (
            <View
              key={event}
              style={{
                backgroundColor: theme.colors.panel,
                borderColor: theme.colors.border,
                borderWidth: 1,
                borderRadius: 24,
                padding: 16,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  backgroundColor: '#1B1B1B',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="time" size={16} color={theme.colors.gold} />
              </View>
              <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '600' }}>{event}</Text>
            </View>
          ))
        ) : (
          <View
            style={{
              backgroundColor: theme.colors.panel,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: 24,
              padding: 16,
            }}
          >
            <Text style={{ color: theme.colors.muted, fontSize: 14 }}>No live events yet.</Text>
          </View>
        )}
      </ScrollView>
    </>
  );
}
