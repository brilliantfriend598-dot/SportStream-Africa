import { ScrollView, Text, View } from 'react-native';
import { DataSourceBadge } from '../../components/DataSourceBadge';
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
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>Video experience preview</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
          These clips are sample cards for now, which is useful for real-device testing of scrolling, tap targets, and content density before streaming is added.
        </Text>
      </View>

      <SectionHeader title="Featured Videos" action="Highlights" />
      {videoItems.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
