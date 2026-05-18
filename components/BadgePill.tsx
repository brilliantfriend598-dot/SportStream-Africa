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
        backgroundColor: theme.colors.bgElevated,
        borderWidth: 1,
        borderColor: theme.colors.borderStrong,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
        alignSelf: 'flex-start',
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '800', letterSpacing: 0.2 }}>{label}</Text>
    </View>
  );
}
