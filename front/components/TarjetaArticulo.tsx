import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Lock } from 'lucide-react-native';
import { Link } from 'expo-router';
import { Card } from '@/components/ui/Card';

const PLACEHOLDER = { uri: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=400&q=60" };

interface TarjetaArticuloProps {
  item: {
    id: string;
    title: string;
    description?: string;
    startingPrice: number;
    currentPrice: number;
    image?: string | null;
  };
  idx: number;
  isAuthenticated: boolean;
  moneda?: string;
}

export const TarjetaArticulo = ({ item, idx, isAuthenticated, moneda }: TarjetaArticuloProps) => {
  const [imgError, setImgError] = useState(false);
  const simbolo = moneda === 'USD' ? 'U$S' : '$';

  return (
    <Card className="overflow-hidden border-gray-200 mb-4">
      <View className="flex-row">
        {/* Miniatura */}
        <View className="m-3 w-24 h-24 bg-gray-100 flex-shrink-0 rounded-lg overflow-hidden">
          <Image
            source={!imgError && item.image ? { uri: item.image } : PLACEHOLDER}
            resizeMode="cover"
            style={{ width: '100%', height: '100%' }}
            onError={() => setImgError(true)}
          />
        </View>

        {/* Contenido */}
        <View className="flex-1 p-4">
          <View className="flex-row justify-between items-start mb-1">
            <Text className="text-[#333F48] font-bold text-base flex-1 mr-2" numberOfLines={2}>
              {item.title}
            </Text>
            <Text className="text-xs text-[#A08C79]">#{String(idx + 1).padStart(3, '0')}</Text>
          </View>

          {item.description ? (
            <Text className="text-[#A08C79] text-xs leading-4 mb-2" numberOfLines={2}>
              {item.description}
            </Text>
          ) : null}

          <View className="flex-row items-center justify-between mt-auto">
            <View>
              <Text className="text-[10px] text-[#A08C79]">Precio Base</Text>
              {isAuthenticated ? (
                <Text className="text-[#C9A063] font-bold text-sm">
                  {simbolo}{Number(item.startingPrice).toLocaleString('es-AR')}
                </Text>
              ) : (
                <Link href="/(autenticacion)/iniciar-sesion" asChild>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Lock color="#A08C79" size={12} />
                    <Text className="text-[#6A4F99] text-xs underline">Iniciá sesión</Text>
                  </TouchableOpacity>
                </Link>
              )}
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};
