import { Text, View } from 'react-native';
import { theme } from '@/constants/theme';

type Props = {
  source: 'live' | 'sample';
};

export function DataSourceBadge({ source }: Props) {
  const isLive = source === 'live';

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        backgroundColor: isLive ? '#102B22' : '#1A1607',
        borderColor: isLive ? '#236E4E' : theme.colors.gold,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 11,
        paddingVertical: 6,
      }}
    >
      <Text style={{ color: isLive ? '#8BE4BF' : theme.colors.gold, fontSize: 12, fontWeight: '800', letterSpacing: 0.2 }}>
        {isLive ? 'Live API' : 'Sample Data'}
      </Text>
    </View>
  );
}
