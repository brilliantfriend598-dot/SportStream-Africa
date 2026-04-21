import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import type { NotificationItem } from '@/data/mockData';

type Props = {
  item: NotificationItem;
};

const ICONS: Record<NotificationItem['type'], keyof typeof Ionicons.glyphMap> = {
  match: 'football',
  news: 'newspaper',
  account: 'person-circle',
};

export function NotificationCard({ item }: Props) {
  return (
    <View
      style={{
        backgroundColor: theme.colors.panel,
        borderColor: item.unread ? theme.colors.gold : theme.colors.border,
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
          width: 44,
          height: 44,
          borderRadius: 16,
          backgroundColor: item.unread ? '#1A1607' : '#1B1B1B',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={ICONS[item.type]} size={18} color={theme.colors.gold} />
      </View>

      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700', flex: 1 }}>{item.title}</Text>
          <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{item.time}</Text>
        </View>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 6 }}>{item.message}</Text>
      </View>
    </View>
  );
}
