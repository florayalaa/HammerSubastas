import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ALTURA_CONTENIDO_HEADER } from './EncabezadoTab';

// Header para pantallas de "acción rápida" (editar perfil, medios de pago, etc.):
// mismo alto que EncabezadoTab, pero violeta sólido y solo con botón de "Volver" (sin logo ni hamburguesa).
export function EncabezadoVolver() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        backgroundColor: '#6A4F99',
        paddingTop: insets.top,
        height: insets.top + ALTURA_CONTENIDO_HEADER,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2">
        <ChevronLeft color="white" size={24} />
        <Text className="text-white text-base font-semibold">Volver</Text>
      </TouchableOpacity>
    </View>
  );
}
