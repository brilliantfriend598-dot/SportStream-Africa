import { RefreshControl, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { LEAGUES } from '../../src/constants/leagues';
import { useStandings } from '../../src/hooks/useStandings';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';

export default function StandingsScreen() {
  const psl = useStandings(LEAGUES.PSL);
  const premierLeague = useStandings(LEAGUES.PREMIER_LEAGUE);

  const refreshing = psl.loading || premierLeague.loading;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            psl.refetch();
            premierLeague.refetch();
          }}
          tintColor={theme.colors.gold}
        />
      }
    >
      <LinearGradient
        colors={[theme.colors.bgElevated, theme.colors.panel, theme.colors.panelWarm]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
        }}
      >
        <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
          Standings
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
          Table control
        </Text>
        <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
          Track the latest table movement, form pressure, and points race across key competitions.
        </Text>
      </LinearGradient>

      <StandingsSection
        title="PSL Table"
        subtitle="South Africa"
        data={psl.data}
        source={psl.source}
        notice={psl.notice}
        loading={psl.loading}
      />

      <StandingsSection
        title="Premier League"
        subtitle="England"
        data={premierLeague.data}
        source={premierLeague.source}
        notice={premierLeague.notice}
        loading={premierLeague.loading}
      />
    </ScrollView>
  );
}

type StandingsSectionProps = {
  title: string;
  subtitle: string;
  data: {
    rank: number;
    team: string;
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
  }[];
  source: 'live' | 'sample';
  notice: string | null;
  loading: boolean;
};

function StandingsSection({ title, subtitle, data, source, notice, loading }: StandingsSectionProps) {
  return (
    <View>
      <SectionHeader title={title} action={subtitle} />
      <View style={{ marginBottom: 12 }}>
        <DataSourceBadge source={source} />
      </View>

      {notice ? (
        <View
          style={{
            backgroundColor: '#1A1607',
            borderColor: theme.colors.gold,
            borderWidth: 1,
            borderRadius: 16,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: theme.colors.gold, fontSize: 12, lineHeight: 18 }}>{notice}</Text>
        </View>
      ) : null}

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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ color: theme.colors.muted, fontSize: 12, width: 34 }}>Pos</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12, flex: 1 }}>Team</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12, width: 30, textAlign: 'center' }}>P</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12, width: 38, textAlign: 'right' }}>Pts</Text>
        </View>

        {loading ? (
          <Text style={{ color: theme.colors.muted }}>Loading standings...</Text>
        ) : (
          data.map((row) => (
            <View
              key={`${title}-${row.rank}-${row.team}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
                paddingTop: 12,
              }}
            >
              <Text style={{ color: theme.colors.gold, fontWeight: '800', width: 34 }}>{row.rank}</Text>
              <Text style={{ color: theme.colors.text, flex: 1 }}>{row.team}</Text>
              <Text style={{ color: theme.colors.muted, width: 30, textAlign: 'center' }}>{row.played}</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '800', width: 38, textAlign: 'right' }}>
                {row.points}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
