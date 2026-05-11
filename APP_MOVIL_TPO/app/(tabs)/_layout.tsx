import { Tabs } from 'expo-router';
import { Home, Gavel, User, Tag, Menu, HandCoins } from 'lucide-react-native';
import { View, TouchableOpacity, Alert } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6A4F99',
        headerShown: true,
        headerRight: () => (
          <TouchableOpacity onPress={() => Alert.alert('Notificaciones', 'Aquí verás tus notificaciones.')} style={{ marginRight: 15 }}>
            <Menu color="#333F48" size={24} />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="auctions"
        options={{
          title: 'Subastas',
          tabBarIcon: ({ color }) => <Gavel color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="sell"
        options={{
          title: 'Vender',
          tabBarIcon: ({ color }) => <Tag color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="bids"
        options={{
          title: 'Mis Pujas',
          tabBarIcon: ({ color }) => <HandCoins color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
