import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ShoppingBag, Trophy, Tag } from 'lucide-react-native';
import { apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function MisCompras() {
  const router = useRouter();
  const { token } = useAuth();
  const [compras, setCompras] = useState<any[]>([]);
  const [stats, setStats] = useState<{ total: number; monto: number }>({ total: 0, monto: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const data = await apiGet('/pujos/mis-pujos', token);
        const ganadas = Array.isArray(data) ? data.filter((p: any) => p.ganador) : [];
        setCompras(ganadas);
        setStats({
          total: ganadas.length,
          monto: ganadas.reduce((acc: number, p: any) => acc + Number(p.amount), 0),
        });
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
      {/* Header */}
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
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 48 }}
        >
          {compras.length === 0 ? (
            <View className="py-16 items-center justify-center">
              <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                <ShoppingBag color="#A08C79" size={32} />
              </View>
              <Text className="text-[#333F48] font-bold text-lg mb-2">Aún no tenés compras</Text>
              <Text className="text-[#A08C79] text-center text-sm">
                Cuando ganes una subasta, el artículo aparecerá aquí.
              </Text>
            </View>
          ) : (
            <>
              {/* Resumen */}
              <View className="flex-row gap-3 mb-5">
                <View className="flex-1 bg-[#6A4F99] p-4 rounded-xl items-center">
                  <Trophy color="white" size={20} />
                  <Text className="text-white/70 text-xs mt-1">Artículos ganados</Text>
                  <Text className="text-white text-2xl font-bold">{stats.total}</Text>
                </View>
                <View className="flex-1 bg-[#C9A063] p-4 rounded-xl items-center">
                  <Tag color="white" size={20} />
                  <Text className="text-white/70 text-xs mt-1">Total invertido</Text>
                  <Text className="text-white text-lg font-bold" numberOfLines={1}>
                    ${Number(stats.monto).toLocaleString('es-AR')}
                  </Text>
                </View>
              </View>

              {/* Lista */}
              {compras.map((compra, idx) => (
                <View
                  key={compra.id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-4"
                >
                  {/* Barra superior ganadora */}
                  <View className="h-1.5 w-full bg-[#6A4F99]" />

                  <View className="p-4">
                    {/* Número de lote */}
                    <Text className="text-[10px] text-[#A08C79] mb-1 uppercase tracking-wide">
                      Lote #{String(idx + 1).padStart(3, '0')}
                    </Text>

                    {/* Nombre del artículo */}
                    <Text className="font-bold text-lg text-[#333F48] mb-1" numberOfLines={2}>
                      {compra.catalogItem?.title || 'Artículo'}
                    </Text>

                    {/* Subasta */}
                    {compra.catalogItem?.auctionTitle ? (
                      <View className="flex-row items-center gap-1 mb-3">
                        <ShoppingBag color="#A08C79" size={12} />
                        <Text className="text-xs text-[#A08C79]" numberOfLines={1}>
                          {compra.catalogItem.auctionTitle}
                        </Text>
                      </View>
                    ) : null}

                    {/* Precio */}
                    <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
                      <View className="flex-row items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                        <Trophy color="#16a34a" size={12} />
                        <Text className="text-green-700 text-xs font-semibold">Puja ganadora</Text>
                      </View>
                      <Text className="font-bold text-xl text-[#6A4F99]">
                        ${Number(compra.amount).toLocaleString('es-AR')}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
