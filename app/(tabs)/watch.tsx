import { ScrollView, Text } from 'react-native';
import { theme } from '../../constants/theme';
import { SectionHeader } from '../../components/SectionHeader';
import { VideoCard } from '../../components/VideoCard';
import { videoItems } from '../../data/mockData';

export default function WatchScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800' }}>Watch</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 8 }}>
        Highlights, analysis, and your African football recap feed.
      </Text>

      <SectionHeader title="Featured Videos" action="Highlights" />
      {videoItems.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
