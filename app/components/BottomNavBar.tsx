import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const tabs = [
  { label: 'Home', icon: 'home-outline' as const, path: '/home' as const },
  { label: 'Support', icon: 'chatbubble-ellipses-outline' as const, path: '/Support' as const },
  { label: 'Learn', icon: 'book-outline' as const, path: '/learn' as const },
  { label: 'Profile', icon: 'person-outline' as const, path: '/(profile)' as const },
];

export default function BottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = pathname === tab.path;

        return (
          <TouchableOpacity
            key={tab.label}
            onPress={() => router.push(tab.path)}
            style={styles.tab}
          >
            <Ionicons
              name={tab.icon}
              size={24}
              color={isActive ? '#4a3b35' : '#999'}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#fffaf6',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  tab: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  activeLabel: {
    color: '#4a3b35',
    fontWeight: '600',
  },
});