import { ScrollView, Text, View } from 'react-native';
import { NotificationCard } from '../../components/NotificationCard';
import { SectionHeader } from '../../components/SectionHeader';
import { theme } from '../../constants/theme';
import { notificationItems } from '../../data/mockData';

export default function NotificationsScreen() {
  const unreadCount = notificationItems.filter((item) => item.unread).length;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bg }}
      contentContainerStyle={{ padding: 16, paddingTop: 20, paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '800' }}>Notifications</Text>
      <Text style={{ color: theme.colors.muted, fontSize: 14, marginTop: 8 }}>
        Alerts, reminders, and tester-facing updates in one stream.
      </Text>

      <View
        style={{
          marginTop: 18,
          backgroundColor: theme.colors.panelSoft,
          borderColor: theme.colors.border,
          borderWidth: 1,
          borderRadius: 24,
          padding: 18,
        }}
      >
        <Text style={{ color: theme.colors.gold, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.4 }}>
          Tester Snapshot
        </Text>
        <Text style={{ color: theme.colors.text, fontSize: 22, fontWeight: '800', marginTop: 8 }}>
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
