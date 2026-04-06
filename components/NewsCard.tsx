import { Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { BadgePill } from '@/components/BadgePill';
import type { NewsItem } from '@/data/mockData';

type Props = {
  item: NewsItem;
};

export function NewsCard({ item }: Props) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: theme.colors.border,
        borderWidth: 1,
        borderRadius: theme.radius.xl,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        gap: 12,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: theme.colors.green,
          opacity: 0.85,
        }}
      />
      <View style={{ flex: 1 }}>
        <BadgePill label={item.tag} />
        <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700', marginTop: 8 }}>
          {item.title}
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 }}>
          {item.summary}
        </Text>
      </View>
    </View>
  );
}
