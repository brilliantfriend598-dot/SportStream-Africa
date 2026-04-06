import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';
import { BadgePill } from '@/components/BadgePill';
import type { VideoItem } from '@/data/mockData';

type Props = {
  item: VideoItem;
};

export function VideoCard({ item }: Props) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        marginBottom: 14,
      }}
    >
      <View
        style={{
          height: 180,
          backgroundColor: theme.colors.green,
          opacity: 0.85,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name="play-circle" size={52} color={theme.colors.gold} />
      </View>

      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700' }}>{item.title}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 4 }}>{item.tag}</Text>
        </View>
        <BadgePill label={item.duration} />
      </View>
    </View>
  );
}
