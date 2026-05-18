import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DataSourceBadge } from '../../components/DataSourceBadge';
import { theme } from '../../constants/theme';
import { SectionHeader } from '../../components/SectionHeader';
import { VideoCard } from '../../components/VideoCard';
import { videoItems } from '../../data/mockData';

export default function WatchScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[theme.colors.bgElevated, '#132031', theme.colors.panel]}
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
          Watch
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
          Screen room
        </Text>
        <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
          Highlights, analysis, and compact recap content designed for quick mobile viewing.
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
        <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '800' }}>Video experience preview</Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18 }}>
          These clips are sample cards for now, which is useful for testing content density, tap targets, and video-list presentation before live streaming is added.
        </Text>
      </View>

      <SectionHeader title="Featured Videos" action="Highlights" />
      {videoItems.map((item) => (
        <VideoCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
