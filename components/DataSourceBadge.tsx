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
        backgroundColor: isLive ? '#0E2E22' : '#1A1607',
        borderColor: isLive ? '#1E8E5A' : theme.colors.gold,
        borderWidth: 1,
        borderRadius: 999,
        paddingHorizontal: 10,
        paddingVertical: 5,
      }}
    >
      <Text style={{ color: isLive ? '#8BE4BF' : theme.colors.gold, fontSize: 12, fontWeight: '700' }}>
        {isLive ? 'Live API' : 'Sample Data'}
      </Text>
    </View>
  );
}
