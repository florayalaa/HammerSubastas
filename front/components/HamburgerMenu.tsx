import { useRouter } from 'expo-router';
import { Bell, Menu, LogOut } from 'lucide-react-native';
import { TouchableOpacity, View, Text, Modal, Pressable } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { useNotificationBadge } from '@/context/NotificationContext';
import { useState } from 'react';

export function HamburgerMenu() {
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
            minWidth: 240,
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
                <Text numberOfLines={1} style={{ color: '#333F48', fontWeight: '600', fontSize: 15 }}>Notificaciones</Text>
                {unreadCount > 0 && (
                  <Text numberOfLines={1} style={{ color: '#A08C79', fontSize: 12 }}>{unreadCount} sin leer</Text>
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
