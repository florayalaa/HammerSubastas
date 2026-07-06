import { Tabs, useRouter } from 'expo-router';
import { Home, Gavel, User, Tag, Bell, HandCoins, Menu, LogOut } from 'lucide-react-native';
import { TouchableOpacity, View, Text, Image, Modal, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { useNotificationBadge } from '@/context/NotificationContext';
import { useEffect, useState } from 'react';

function HamburgerMenu() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotificationBadge();
  const [visible, setVisible] = useState(false);

  const handleNotificaciones = () => {
    setVisible(false);
    router.push('/notifications');
  };

  const handleCerrarSesion = async () => {
    setVisible(false);
    await logout();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 15, padding: 4 }}>
        <View>
          <Menu color="white" size={26} />
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

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => setVisible(false)}
        >
          <View style={{
            position: 'absolute',
            top: 56,
            right: 12,
            backgroundColor: 'white',
            borderRadius: 14,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 10,
            minWidth: 200,
            overflow: 'hidden',
          }}>
            <TouchableOpacity
              onPress={handleNotificaciones}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 18,
                borderBottomWidth: 1,
                borderBottomColor: '#f0f0f0',
                gap: 12,
              }}
            >
              <Bell color="#6A4F99" size={20} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#333F48', fontWeight: '600', fontSize: 15 }}>Notificaciones</Text>
                {unreadCount > 0 && (
                  <Text style={{ color: '#A08C79', fontSize: 12 }}>{unreadCount} sin leer</Text>
                )}
              </View>
              {unreadCount > 0 && (
                <View style={{
                  backgroundColor: '#ef4444',
                  borderRadius: 10,
                  minWidth: 20,
                  height: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 5,
                }}>
                  <Text style={{ color: 'white', fontSize: 11, fontWeight: 'bold' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {isAuthenticated && (
              <TouchableOpacity
                onPress={handleCerrarSesion}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 18,
                  gap: 12,
                }}
              >
                <LogOut color="#EE3B3B" size={20} />
                <Text style={{ color: '#EE3B3B', fontWeight: '600', fontSize: 15 }}>Cerrar Sesión</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

export default function TabLayout() {
  const { isAuthenticated, token } = useAuth();
  const { refreshCount } = useNotificationBadge();

  useEffect(() => {
    if (!token) return;
    refreshCount(token);
    const interval = setInterval(() => refreshCount(token), 30000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Tabs
      screenOptions={{
        /* ── Tab bar ── */
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.85)',
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['#6A4F99', '#C9A063']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ),

        /* ── Header ── */
        headerShown: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerBackground: () => (
          <LinearGradient
            colors={['#6A4F99', '#C9A063']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ flex: 1 }}
          />
        ),
        headerTintColor: 'white',
        headerTitleStyle: { color: 'white', fontWeight: '700' as const },
        headerLeft: () => (
          <Image
            source={require('@/assets/images/Logo Hammer Oro.png')}
            style={{ width: 34, height: 34, marginLeft: 14 }}
            resizeMode="contain"
          />
        ),
        headerRight: isAuthenticated ? () => <HamburgerMenu /> : undefined,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
          href: isAuthenticated ? undefined : null,
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
