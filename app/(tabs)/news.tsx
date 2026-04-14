import { ScrollView, Text } from 'react-native';
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

      <SectionHeader title="Latest Stories" action="Latest" />
      {newsItems.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
