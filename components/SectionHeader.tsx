import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

type Props = {
  title: string;
  action?: string;
  onPress?: () => void;
};

export function SectionHeader({ title, action = 'See all', onPress }: Props) {
  return (
    <View
      style={{
        marginTop: 28,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View>
        <Text style={{ color: theme.colors.text, fontSize: 17, fontWeight: '800', letterSpacing: 0.2 }}>
          {title}
        </Text>
        <View
          style={{
            marginTop: 6,
            width: 32,
            height: 3,
            borderRadius: 999,
            backgroundColor: theme.colors.gold,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={onPress}
        disabled={!onPress}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 4,
          opacity: onPress ? 1 : 0.6,
          backgroundColor: theme.colors.panel,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 999,
          paddingHorizontal: 10,
          paddingVertical: 6,
        }}
      >
        <Text style={{ color: theme.colors.gold, fontSize: 12, fontWeight: '600' }}>{action}</Text>
        <Ionicons name="chevron-forward" size={14} color={theme.colors.gold} />
      </TouchableOpacity>
    </View>
  );
}
