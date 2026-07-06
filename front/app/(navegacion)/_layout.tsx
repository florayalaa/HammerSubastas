import { Tabs } from 'expo-router';
import { Home, Gavel, User, Tag, HandCoins } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { useNotificationBadge } from '@/context/NotificationContext';
import { useEffect } from 'react';

// Al tocar el ícono de un tab con stack anidado (subastas/perfil), siempre resetea a su pantalla inicial
// en vez de mantener la última pantalla visitada (ej: "editar perfil").
function resetearAlTocarTab(nombreTab: string) {
  return ({ navigation }: any) => ({
    tabPress: (e: any) => {
      e.preventDefault();
      navigation.navigate(nombreTab, { screen: 'index' });
    },
  });
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

        // Cada pantalla renderiza su propio <EncabezadoTab/> — el header nativo queda apagado
        // en todos lados para evitar la cápsula "Liquid Glass" de iOS y lograr un look idéntico.
        headerShown: false,
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
        listeners={resetearAlTocarTab('subastas')}
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
        listeners={resetearAlTocarTab('perfil')}
      />
    </Tabs>
  );
}
