import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShoppingBag } from 'lucide-react-native';
import { apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function MyPurchases() {
  const router = useRouter();
  const { token } = useAuth();
  const [compras, setCompras] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const data = await apiGet('/pujos/mis-pujos', token);
        const ganadas = Array.isArray(data) ? data.filter((p: any) => p.ganador) : [];
        setCompras(ganadas);
      } catch (e) {
        console.warn('Error al obtener compras', e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-12 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver al Perfil</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Mis Compras</Text>
        <Text className="text-[#A08C79]">Artículos que ganaste en subasta</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A4F99" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
          {compras.length === 0 ? (
            <View className="py-12 items-center justify-center">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <ShoppingBag color="#A08C79" size={32} />
              </View>
              <Text className="text-[#333F48] font-bold text-lg mb-2">Aún no tenés compras</Text>
              <Text className="text-[#A08C79] text-center">Cuando ganes una subasta, aparecerá aquí.</Text>
            </View>
          ) : (
            compras.map((compra) => (
              <View key={compra.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-4">
                <View className="h-1.5 w-full bg-[#6A4F99]" />
                <View className="p-4">
                  <Text className="font-bold text-lg text-[#333F48] mb-1" numberOfLines={2}>
                    {compra.catalogItem?.title || 'Artículo'}
                  </Text>
                  {compra.catalogItem?.auctionTitle ? (
                    <Text className="text-xs text-[#A08C79] mb-3">{compra.catalogItem.auctionTitle}</Text>
                  ) : null}
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                    <Text className="text-[#A08C79] text-sm">Puja ganadora</Text>
                    <Text className="font-bold text-lg text-[#6A4F99]">
                      ${Number(compra.amount).toLocaleString('es-AR')}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}
