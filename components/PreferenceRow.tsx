import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

type Props = {
  label: string;
  value: string;
};

export function PreferenceRow({ label, value }: Props) {
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
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flex: 1, paddingRight: 12 }}>
        <Text style={{ color: theme.colors.muted, fontSize: 13 }}>{label}</Text>
        <Text style={{ color: theme.colors.text, fontSize: 15, fontWeight: '700', marginTop: 4 }}>
          {value}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={theme.colors.gold} />
    </View>
  );
}
