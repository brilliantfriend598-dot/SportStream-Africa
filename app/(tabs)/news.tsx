import { ScrollView, Text, View } from 'react-native';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { theme } from '../../constants/theme';
import { SectionHeader } from '../../components/SectionHeader';
import { NewsCard } from '../../components/NewsCard';
import { newsItems } from '../../data/mockData';

export default function NewsScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800' }}>Football News</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 8 }}>
        Daily updates, transfer buzz, and local league stories.
      </Text>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
          gap: 10,
        }}
      >
        <DataSourceBadge source="sample" />
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>Editorial preview feed</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
          This section is still using curated sample stories so testers can focus on layout, readability, and flow while the live content layer is prepared.
        </Text>
      </View>

      <SectionHeader title="Latest Stories" action="Latest" />
      {newsItems.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
