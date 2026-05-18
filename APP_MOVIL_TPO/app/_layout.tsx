import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import '../global.css';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { View, Text } from 'react-native';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutNav() {
  const { isAuthenticated, isReady, showSplash } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isReady || showSplash) return;

    const inAuthGroup = segments[0] === '(auth)';
    
    // If we are at the index route, we allow it (landing page)
    if (segments.length === 0 || segments[0] === '') return;

    if (!isAuthenticated && !inAuthGroup && segments[0] !== '(tabs)') {
      // Allow them to browse tabs? In web, some parts of auctions were public.
      // But let's protect tabs for now if needed. 
    }
  }, [isAuthenticated, isReady, showSplash, segments]);

  if (!isReady || showSplash) {
    return (
      <LinearGradient
        colors={['#6B21A8', '#B8860B']} // morado → dorado
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text className="text-5xl font-bold text-white mb-2">
          HAMMER
        </Text>
        <Text className="text-base italic text-white mb-6">
          Tu plataforma de subastas de confianza
        </Text>

        {/* Puntos del carrusel */}
        <View className="flex-row space-x-2">
          <View className="w-2 h-2 rounded-full bg-white" />
          <View className="w-2 h-2 rounded-full bg-white" />
          <View className="w-2 h-2 rounded-full bg-white" />
        </View>
      </LinearGradient>
    );
  }


  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <RootLayoutNav />
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
