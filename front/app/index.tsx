import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isReady && isAuthenticated) {
      router.replace('/(navegacion)');
    }
  }, [isReady, isAuthenticated]);

  if (!isReady || isAuthenticated) return null;

  return (
    <LinearGradient
      colors={['#6A4F99', '#C9A063']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <Image
            source={require('@/assets/images/Logo Hammer.png')}
            style={{ width: 110, height: 110 }}
            resizeMode="contain"
          />

          <Text className="text-4xl font-bold text-white mb-4 text-center">
            Bienvenido a HAMMER
          </Text>

          <Text className="text-lg text-white/90 mb-8 text-center max-w-[300px]">
            Participá en subastas exclusivas, vendé tus artículos de valor y unite a una comunidad de coleccionistas y compradores exigentes.
          </Text>

          <View className="w-full gap-4 mt-6">
            <Link href="/(navegacion)/subastas" asChild>
              <Button className="w-full bg-white h-14 rounded-xl" textClassName="text-[#6A4F99] font-bold text-lg">
                Ver Subastas
              </Button>
            </Link>

            <Link href="/(autenticacion)/registro" asChild>
              <Button className="w-full bg-[#6A4F99] border-2 border-white h-14 rounded-xl" textClassName="text-white font-bold text-lg">
                Registrarse
              </Button>
            </Link>

            <Link href="/(autenticacion)/iniciar-sesion" asChild>
              <Button variant="ghost" className="w-full mt-2" textClassName="text-white font-medium">
                ¿Ya tenés cuenta? Iniciá sesión
              </Button>
            </Link>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
