import { Tabs, useRouter } from 'expo-router';
import { Home, Gavel, User, Tag, Bell, HandCoins } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNotificationBadge } from '@/context/NotificationContext';
import { useEffect } from 'react';

export default function TabLayout() {
  const router = useRouter();
  const { isAuthenticated, token } = useAuth();
  const { unreadCount, refreshCount } = useNotificationBadge();

  useEffect(() => {
    if (!token) return;
    refreshCount(token);
    const interval = setInterval(() => refreshCount(token), 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A4F99',
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={() => router.push('/notifications')} style={{ marginRight: 15 }}>
            <View>
              <Bell color="#333F48" size={24} />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  backgroundColor: '#ef4444',
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}>
                  <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="subastas"
        options={{
          title: 'Subastas',
          tabBarIcon: ({ color }) => <Gavel color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="vender"
        options={{
          title: 'Vender',
          tabBarIcon: ({ color }) => <Tag color={color} size={24} />,
          href: isAuthenticated ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="pujas"
        options={{
          title: 'Mis Pujas',
          tabBarIcon: ({ color }) => <HandCoins color={color} size={24} />,
          href: isAuthenticated ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
          href: isAuthenticated ? undefined : null,
        }}
      />
    </Tabs>
  );
}
