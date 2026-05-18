import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '@/constants/theme';
import { BadgePill } from '@/components/BadgePill';
import type { NewsItem } from '@/data/mockData';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  const initials = item.tag
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.borderStrong,
        borderWidth: 1,
        borderRadius: theme.radius.xl,
        padding: 16,
        marginBottom: 14,
        flexDirection: 'row',
        gap: 12,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          position: 'absolute',
          top: -18,
          right: -18,
          width: 74,
          height: 74,
          borderRadius: 999,
          backgroundColor: theme.colors.panelWarm,
        }}
      />
      <LinearGradient
        colors={['#11281E', '#1A4B37', '#8D6C1A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 92,
          height: 112,
          borderRadius: 22,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
          padding: 12,
          justifyContent: 'space-between',
        }}
      >
        <View
          style={{
            position: 'absolute',
            top: -10,
            right: -10,
            width: 52,
            height: 52,
            borderRadius: 999,
            backgroundColor: 'rgba(255, 215, 94, 0.14)',
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 18,
            left: -12,
            width: 64,
            height: 64,
            borderRadius: 999,
            backgroundColor: 'rgba(8, 12, 15, 0.18)',
          }}
        />
        <Text style={{ color: 'rgba(255,255,255,0.76)', fontSize: 10, fontWeight: '700', letterSpacing: 1.4 }}>
          MATCHDAY FILE
        </Text>
        <View style={{ gap: 6 }}>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <View style={{ height: 4, width: 24, borderRadius: 999, backgroundColor: theme.colors.gold }} />
            <View style={{ height: 4, width: 14, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.3)' }} />
          </View>
          <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', lineHeight: 30 }}>{initials}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.74)', fontSize: 11, fontWeight: '700' }}>{item.tag}</Text>
        </View>
      </LinearGradient>
      <View style={{ flex: 1 }}>
        <BadgePill label={item.tag} />
        <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '800', marginTop: 8, lineHeight: 22 }}>
          {item.title}
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 }}>
          {item.summary}
        </Text>
      </View>
    </View>
  );
}
