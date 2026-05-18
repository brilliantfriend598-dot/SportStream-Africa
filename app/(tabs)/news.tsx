import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { theme } from '../../constants/theme';
import { SectionHeader } from '../../components/SectionHeader';
import { NewsCard } from '../../components/NewsCard';
import { newsItems } from '../../data/mockData';

export default function NewsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[theme.colors.panel, theme.colors.panelWarm, theme.colors.bgElevated]}
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
          News
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
          Story desk
        </Text>
        <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
          Daily updates, transfer buzz, and local league storylines in a cleaner editorial feed.
        </Text>
      </LinearGradient>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 10,
        }}
      >
        <DataSourceBadge source="sample" />
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>Editorial preview feed</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
          This section is still using curated sample stories so testers can focus on readability, content pacing, and scroll rhythm while the live news source is prepared.
        </Text>
      </View>

      <SectionHeader title="Latest Stories" action="Latest" />
      {newsItems.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
