import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { HamburgerMenu } from './HamburgerMenu';

// Alto del contenido del header, sin contar el inset superior (notch/status bar).
// Se exporta para que las pantallas puedan alinear su título grande siempre a la misma altura.
export const ALTURA_CONTENIDO_HEADER = 56;

// Header propio (no nativo) para que se vea idéntico en todas las pantallas de nivel tab
// y en los detalles empujados dentro de un stack — mismo alto, mismo logo a la izquierda,
// título centrado, y menú hamburguesa a la derecha. Al no usar headerLeft/headerRight nativos,
// evita la cápsula "Liquid Glass" que iOS 26 agrega automáticamente a esos botones nativos.
export function EncabezadoTab({ titulo }: { titulo: string }) {
  const insets = useSafeAreaInsets();
  const { isAuthenticated } = useAuth();

  return (
    <LinearGradient
      colors={['#6A4F99', '#C9A063']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ paddingTop: insets.top, height: insets.top + ALTURA_CONTENIDO_HEADER }}
    >
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14 }}>
        <Image
          source={require('@/assets/images/Logo Hammer Oro.png')}
          style={{ width: 34, height: 34 }}
          resizeMode="contain"
        />
        <View style={{ flex: 1 }} />
        {isAuthenticated && <HamburgerMenu />}
      </View>

      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: insets.top,
          left: 0,
          right: 0,
          height: ALTURA_CONTENIDO_HEADER,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text numberOfLines={1} style={{ color: 'white', fontWeight: '700', fontSize: 17, maxWidth: '60%' }}>
          {titulo}
        </Text>
      </View>
    </LinearGradient>
  );
}
