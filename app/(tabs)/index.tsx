import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../../constants/theme';
import { useTodayMatches } from '../../src/hooks/useTodayMatches';
import { MatchCard } from '../../components/MatchCard';
import { NewsCard } from '../../components/NewsCard';
import { SectionHeader } from '../../components/SectionHeader';

export default function HomeScreen() {
  const router = useRouter();
  const { data: matches, loading, error } = useTodayMatches();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', letterSpacing: 2, textTransform: 'uppercase' }}>
            SportStream Africa
          </Text>
          <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 6 }}>
            The Pulse of African Football
          </Text>
        </View>
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.panel,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="notifications" size={18} color={theme.colors.text} />
        </View>
      </View>

      <LinearGradient
        colors={[theme.colors.green, theme.colors.greenDark]}
        style={{ borderRadius: 24, padding: 20, marginTop: 18 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '700', letterSpacing: 1.4, textTransform: 'uppercase' }}>
              Live now
            </Text>
            <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800', marginTop: 8 }}>
              Matchday Central
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 20, marginTop: 8 }}>
              Scores, highlights, and African football in one place.
            </Text>
          </View>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 18,
              backgroundColor: theme.colors.whiteSoft,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="trophy" size={26} color={theme.colors.gold} />
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/fixtures')}
          style={{
            marginTop: 18,
            backgroundColor: theme.colors.gold,
            borderRadius: 18,
            paddingVertical: 14,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#111111', fontSize: 15, fontWeight: '800' }}>Explore today’s fixtures</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View
        style={{
          marginTop: 16,
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 18,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          height: 50,
        }}
      >
        <Ionicons name="search" size={16} color={theme.colors.muted} />
        <TextInput
          placeholder="Search league, club, or match"
          placeholderTextColor={theme.colors.muted}
          style={{ flex: 1, color: theme.colors.text, fontSize: 14 }}
        />
      </View>

      <SectionHeader
        title="Today’s Matches"
        action="All fixtures"
        onPress={() => router.push('/fixtures')}
      />
      {loading ? (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ color: theme.colors.muted }}>Loading matches...</Text>
        </View>
      ) : error ? (
        <View style={{ alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ color: theme.colors.muted }}>Failed to load matches</Text>
        </View>
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
              stats: []
            }}
          />
        ))
      )}

      <SectionHeader title="Trending" />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.panel,
            borderColor: theme.colors.border,
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
              backgroundColor: '#1B1B1B',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons name="trending-up" size={18} color={theme.colors.gold} />
          </View>
          <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>Title race</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 6 }}>Premier League</Text>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: theme.colors.panelSoft,
            borderColor: theme.colors.border,
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
              backgroundColor: '#1B1B1B',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons name="shield-checkmark" size={18} color={theme.colors.gold} />
          </View>
          <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700' }}>PSL focus</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 6 }}>Africa Hub</Text>
        </View>
      </View>

      <SectionHeader title="Top News" />
      <View style={{ alignItems: 'center', paddingVertical: 20 }}>
        <Text style={{ color: theme.colors.muted }}>News feed coming soon</Text>
      </View>
    </ScrollView>
  );
}
