import { Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  label: string;
  color?: string;
};

export function BadgePill({ label, color = theme.colors.gold }: Props) {
  return (
    <View
      style={{
        backgroundColor: '#1B1B1B',
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}
