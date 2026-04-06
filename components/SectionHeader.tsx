import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type Props = {
  title: string;
  action?: string;
};

export function SectionHeader({ title, action = 'See all' }: Props) {
  return (
    <View
      style={{
        marginTop: 24,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight: '700' }}>{title}</Text>
      <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text style={{ color: theme.colors.gold, fontSize: 12, fontWeight: '600' }}>{action}</Text>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.gold} />
      </TouchableOpacity>
    </View>
  );
}
