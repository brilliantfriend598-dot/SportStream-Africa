import { RefreshControl, ScrollView, Text, View } from 'react-native';
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
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
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
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800' }}>Standings</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 8 }}>
        Track the latest table movement across key competitions.
      </Text>

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
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 16,
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
              <Text style={{ color: theme.colors.gold, fontWeight: '700', width: 34 }}>{row.rank}</Text>
              <Text style={{ color: theme.colors.text, flex: 1 }}>{row.team}</Text>
              <Text style={{ color: theme.colors.muted, width: 30, textAlign: 'center' }}>{row.played}</Text>
              <Text style={{ color: theme.colors.text, fontWeight: '700', width: 38, textAlign: 'right' }}>
                {row.points}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
