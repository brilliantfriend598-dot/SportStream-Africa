import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
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
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        marginBottom: 14,
      }}
    >
      <LinearGradient
        colors={['#0B141A', '#15352C', '#7E6120']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          height: 196,
          padding: 18,
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -32,
            right: -18,
            width: 126,
            height: 126,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 215, 94, 0.12)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: -28,
            left: -20,
            width: 148,
            height: 148,
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.05)',
          }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View
            style={{
              backgroundColor: 'rgba(7, 11, 14, 0.4)',
              borderColor: 'rgba(255,255,255,0.08)',
              borderWidth: 1,
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: theme.colors.text, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 }}>SPORTSTREAM TV</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: '#FF6B4A' }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: theme.colors.gold }} />
            <View style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.45)' }} />
          </View>
        </View>
        <View
          style={{
            width: 86,
            height: 86,
            borderRadius: 999,
            backgroundColor: 'rgba(0,0,0,0.24)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'center',
            shadowColor: theme.colors.shadow,
            shadowOpacity: 0.24,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 12 },
          }}
        >
          <Ionicons name="play-circle" size={52} color={theme.colors.gold} />
        </View>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <View style={{ height: 4, width: 28, borderRadius: 999, backgroundColor: theme.colors.gold }} />
            <View style={{ height: 4, width: 18, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </View>
          <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: '900' }}>Matchnight Cut</Text>
          <Text style={{ color: 'rgba(255,255,255,0.72)', fontSize: 12, fontWeight: '600' }}>
            Quick-hit recaps, tunnel reactions, and analyst picks.
          </Text>
        </View>
      </LinearGradient>

      <View style={{ padding: 16, flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '800', lineHeight: 22 }}>{item.title}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 13, marginTop: 4 }}>{item.tag}</Text>
        </View>
        <BadgePill label={item.duration} />
      </View>
    </View>
  );
}
