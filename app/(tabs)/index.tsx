import { RefreshControl, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { LEAGUES } from '../../src/constants/leagues';
import { useStandings } from '../../src/hooks/useStandings';
import { useTodayMatches } from '../../src/hooks/useTodayMatches';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { MatchCard } from '../../components/MatchCard';
import { NewsCard } from '../../components/NewsCard';
import { SectionHeader } from '../../components/SectionHeader';
import { newsItems } from '../../data/mockData';

const quickAccessItems = [
  { label: 'Fixtures', icon: 'calendar', route: '/fixtures', tone: '#123628', hint: 'Matches now' },
  { label: 'Standings', icon: 'stats-chart', route: '/standings', tone: '#1A1607', hint: 'Table watch' },
  { label: 'News', icon: 'newspaper', route: '/news', tone: '#1A1320', hint: 'Top stories' },
  { label: 'Watch', icon: 'play-circle', route: '/watch', tone: '#122131', hint: 'Highlights' },
  { label: 'Profile', icon: 'person', route: '/profile', tone: '#1A1A1A', hint: 'Your account' },
  { label: 'Testing', icon: 'flask', route: '/testing', tone: '#24140D', hint: 'QA tools' },
] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { data: matches, loading, error, notice, source, refetch } = useTodayMatches();
  const {
    data: standings,
    loading: standingsLoading,
    notice: standingsNotice,
    source: standingsSource,
  } = useStandings(LEAGUES.PSL);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} tintColor={theme.colors.gold} />
      }
    >
      <View
        style={{
          position: 'absolute',
          top: -70,
          right: -46,
          width: 190,
          height: 190,
          borderRadius: 999,
          backgroundColor: 'rgba(11,110,79,0.16)',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 220,
          left: -58,
          width: 140,
          height: 140,
          borderRadius: 999,
          backgroundColor: 'rgba(244,196,48,0.08)',
        }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              color: theme.colors.gold,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            SportStream Africa
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', lineHeight: 32, marginTop: 8 }}>
            The Pulse of African Football
          </Text>
          <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
            Matchday intelligence, storylines, and club energy for fans who track every shift.
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => router.push('/login')}
            style={{
              minWidth: 74,
              height: 42,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.panel,
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 13, fontWeight: '700' }}>Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push('/notifications')}
            style={{
              width: 42,
              height: 42,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: theme.colors.borderStrong,
              backgroundColor: theme.colors.panel,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="notifications" size={18} color={theme.colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <LinearGradient
        colors={[theme.colors.green, '#0D5944', theme.colors.greenDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 22,
          marginTop: 24,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.08)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 }}>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: 'rgba(255,255,255,0.72)',
                fontSize: 12,
                fontWeight: '700',
                letterSpacing: 1.4,
                textTransform: 'uppercase',
              }}
            >
              Live now
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '900', marginTop: 10 }}>
              Matchday Central
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 20, marginTop: 8 }}>
              Scores, highlights, and African football in one place.
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <HeroStat label="Coverage" value="5 leagues" />
              <HeroStat label="Feed" value={source === 'live' ? 'Live' : 'Sample'} />
            </View>
          </View>
          <View
            style={{
              width: 66,
              height: 66,
              borderRadius: 22,
              backgroundColor: theme.colors.whiteSoft,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="trophy" size={30} color={theme.colors.gold} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/fixtures')}
          style={{
            marginTop: 20,
            backgroundColor: theme.colors.gold,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#111111', fontSize: 15, fontWeight: '800' }}>Explore today's fixtures</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.bgElevated,
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
          borderRadius: 22,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          height: 54,
        }}
      >
        <Ionicons name="search" size={16} color={theme.colors.muted} />
        <TextInput
          placeholder="Search league, club, or match"
          placeholderTextColor={theme.colors.muted}
          style={{ flex: 1, color: theme.colors.text, fontSize: 14 }}
        />
      </View>

      <SectionHeader title="Quick Access" action="Open profile" onPress={() => router.push('/profile')} />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 }}>
        {quickAccessItems.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={() =>
              router.push(
                item.route as '/fixtures' | '/standings' | '/news' | '/watch' | '/profile' | '/testing',
              )
            }
            style={{
              width: '48%',
              backgroundColor: theme.colors.panel,
              borderColor: theme.colors.borderStrong,
              borderWidth: 1,
              borderRadius: 22,
              padding: 16,
              gap: 10,
              overflow: 'hidden',
            }}
          >
            <View
              style={{
                position: 'absolute',
                top: -16,
                right: -16,
                width: 72,
                height: 72,
                borderRadius: 999,
                backgroundColor: item.tone,
              }}
            />
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 16,
                backgroundColor: item.tone,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.06)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name={item.icon as 'calendar' | 'stats-chart' | 'newspaper' | 'play-circle' | 'person' | 'flask'}
                size={18}
                color={theme.colors.gold}
              />
            </View>
            <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>{item.label}</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{item.hint}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <SectionHeader title="Today's Matches" action="All fixtures" onPress={() => router.push('/fixtures')} />
      <View style={{ marginBottom: 12 }}>
        <DataSourceBadge source={source} />
      </View>
      {notice ? (
        <NoticeBanner text={notice} />
      ) : null}
      {loading ? (
        <EmptyState label="Loading matches..." />
      ) : error ? (
        <EmptyState label="Failed to load matches" />
      ) : (
        matches.slice(0, 3).map((match) => (
          <MatchCard
            key={match.id}
            match={{
              id: String(match.id),
              league: match.league,
              home: match.home,
              away: match.away,
              time: match.time,
              status: match.status as 'LIVE' | 'UPCOMING' | 'FT',
              score: match.score,
              events: [],
              stats: [],
            }}
          />
        ))
      )}

      <SectionHeader title="Table Watch" action="Full table" onPress={() => router.push('/standings')} />
      <View style={{ marginBottom: 12 }}>
        <DataSourceBadge source={standingsSource} />
      </View>
      {standingsNotice ? (
        <NoticeBanner text={standingsNotice} />
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '800' }}>PSL top teams</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>Points</Text>
        </View>

        {standingsLoading ? (
          <Text style={{ color: theme.colors.muted }}>Loading standings...</Text>
        ) : (
          standings.slice(0, 3).map((row) => (
            <View
              key={`${row.rank}-${row.team}`}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 8,
                borderTopWidth: 1,
                borderTopColor: theme.colors.border,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ color: theme.colors.gold, fontWeight: '800', minWidth: 18 }}>{row.rank}</Text>
                <Text style={{ color: theme.colors.text }}>{row.team}</Text>
              </View>
              <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{row.points}</Text>
            </View>
          ))
        )}
      </View>

      <SectionHeader title="Trending" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <TrendCard
          icon="trending-up"
          title="Title race"
          subtitle="Premier League"
          tone={theme.colors.greenSoft}
        />
        <TrendCard
          icon="shield-checkmark"
          title="PSL focus"
          subtitle="Africa Hub"
          tone="#261E09"
          panelColor={theme.colors.panelWarm}
        />
      </View>

      <SectionHeader title="Top News" action="Open news" onPress={() => router.push('/news')} />
      <NewsCard item={newsItems[0]} />
    </ScrollView>
  );
}

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
      }}
    >
      <Text style={{ color: 'rgba(255,255,255,0.68)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
        {label}
      </Text>
      <Text style={{ color: theme.colors.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>{value}</Text>
    </View>
  );
}

function NoticeBanner({ text }: { text: string }) {
  return (
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
      <Text style={{ color: theme.colors.gold, fontSize: 12, lineHeight: 18 }}>{text}</Text>
    </View>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 20 }}>
      <Text style={{ color: theme.colors.muted }}>{label}</Text>
    </View>
  );
}

function TrendCard({
  icon,
  title,
  subtitle,
  tone,
  panelColor,
}: {
  icon: 'trending-up' | 'shield-checkmark';
  title: string;
  subtitle: string;
  tone: string;
  panelColor?: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: panelColor ?? theme.colors.panel,
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: 24,
        padding: 16,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 16,
          backgroundColor: tone,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 12,
        }}
      >
        <Ionicons name={icon} size={18} color={theme.colors.gold} />
      </View>
      <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>{title}</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 6 }}>{subtitle}</Text>
    </View>
  );
}
