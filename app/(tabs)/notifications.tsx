import { ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NotificationCard } from '../../components/NotificationCard';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import { notificationItems } from '../../data/mockData';

export default function NotificationsScreen() {
  const unreadCount = notificationItems.filter((item) => item.unread).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={[theme.colors.panel, theme.colors.bgElevated, theme.colors.panelWarm]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 28,
          padding: 20,
          borderWidth: 1,
          borderColor: theme.colors.borderStrong,
        }}
      >
        <Text style={{ color: theme.colors.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 }}>
          Notifications
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900', marginTop: 8 }}>
          Alert center
        </Text>
        <Text style={{ color: theme.colors.mutedSoft, fontSize: 14, lineHeight: 20, marginTop: 10 }}>
          Alerts, reminders, and tester-facing updates in one cleaner mobile inbox.
        </Text>
      </LinearGradient>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.borderStrong,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
        }}
      >
        <Text style={{ color: theme.colors.gold, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4 }}>
          Tester Snapshot
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: '900', marginTop: 8 }}>
          {unreadCount} unread updates
        </Text>
        <Text style={{ color: theme.colors.muted, fontSize: 13, lineHeight: 18, marginTop: 8 }}>
          Use this screen during device testing to confirm alerts feel useful, readable, and easy to scan.
        </Text>
      </View>

      <SectionHeader title="Recent Activity" action="Inbox" />
      {notificationItems.map((item) => (
        <NotificationCard key={item.id} item={item} />
      ))}
    </ScrollView>
  );
}
