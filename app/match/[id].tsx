import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams } from 'expo-router';
import { DataSourceBadge } from '@/components/DataSourceBadge';
import { theme } from '@/constants/theme';
import { useMatchDetails } from '@/src/hooks/useMatchDetails';
import type { MatchEvent, MatchStat } from '@/src/services/footballTypes';

export default function MatchDetailsScreen() {
  const params = useLocalSearchParams();
  const matchId = Number(params.id);
  const { data, loading, error, notice, source } = useMatchDetails(matchId);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg }}>
        <ActivityIndicator size="large" color={theme.colors.gold} />
        <Text style={{ color: theme.colors.muted, marginTop: 16 }}>Loading match details...</Text>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.bg, padding: 20 }}>
        <Text style={{ color: theme.colors.gold, fontSize: 18, marginBottom: 16 }}>Failed to load match</Text>
        <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>{error ?? 'Match not found'}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120, gap: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[theme.colors.greenDark, theme.colors.green, theme.colors.bgElevated]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
        }}
      >
        <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          {data.league}
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '900', lineHeight: 36, marginTop: 10 }}>
          {data.home} {data.score} {data.away}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}>
          <StatusChip label={data.status} />
          <DataSourceBadge source={source} />
        </View>
        {data.venue ? (
          <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, marginTop: 12 }}>
            Venue: {data.venue}
          </Text>
        ) : null}
      </LinearGradient>

      {notice ? (
        <View
          style={{
            backgroundColor: '#1A1607',
            borderColor: theme.colors.gold,
            borderWidth: 1,
            borderRadius: 16,
            padding: 12,
          }}
        >
          <Text style={{ color: theme.colors.gold, fontSize: 12, lineHeight: 18 }}>{notice}</Text>
        </View>
      ) : null}

      <SectionCard title="Stats">
        {data.stats.map((item: MatchStat) => (
          <View
            key={item.label}
            style={{
              backgroundColor: theme.colors.bgElevated,
              borderRadius: 18,
              padding: 14,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{ color: theme.colors.muted }}>{item.label}</Text>
            <Text style={{ color: theme.colors.text, fontWeight: '700' }}>{item.value}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Timeline">
        {data.events.map((event: MatchEvent, index: number) => (
          <View
            key={`${event.time}-${index}`}
            style={{
              backgroundColor: theme.colors.bgElevated,
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: theme.colors.border,
            }}
          >
            <Text style={{ color: theme.colors.gold, fontWeight: '700' }}>{event.time}</Text>
            <Text style={{ color: theme.colors.text, marginTop: 6, lineHeight: 20 }}>{event.detail}</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

function StatusChip({ label }: { label: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: 26,
        padding: 18,
        gap: 12,
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>{title}</Text>
      {children}
    </View>
  );
}
