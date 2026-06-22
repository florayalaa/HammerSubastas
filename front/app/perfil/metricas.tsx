import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, TrendingUp, Award, BarChart3, Package } from 'lucide-react-native';
import { apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Metrics() {
  const router = useRouter();
  const { token } = useAuth();
  const [stats, setStats] = useState<{ totalBids: number; auctionsWon: number; itemsSold: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await apiGet('/usuarios/yo/estadisticas', token);
        setStats(res);
      } catch (e) {
        console.warn('Error al obtener métricas', e);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  const winRate = stats && stats.totalBids > 0
    ? Math.round((stats.auctionsWon / stats.totalBids) * 100)
    : 0;

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="bg-white pt-14 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver al Perfil</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Mis Métricas</Text>
        <Text className="text-[#A08C79]">Análisis de tu participación en subastas</Text>
      </View>

      {loading ? (
        <View className="py-20 items-center">
          <ActivityIndicator size="large" color="#6A4F99" />
        </View>
      ) : (
        <View className="p-4 gap-4">
          <View className="flex-row gap-4">
            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <View className="w-10 h-10 bg-[#6A4F99]/10 rounded-full items-center justify-center mb-3">
                <Award color="#6A4F99" size={20} />
              </View>
              <Text className="text-[#A08C79] text-xs font-medium mb-1">Tasa de Victorias</Text>
              <Text className="text-2xl font-bold text-[#333F48]">{winRate}%</Text>
            </View>

            <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-3">
                <TrendingUp color="#16a34a" size={20} />
              </View>
              <Text className="text-[#A08C79] text-xs font-medium mb-1">Pujas Realizadas</Text>
              <Text className="text-2xl font-bold text-[#333F48]">{stats?.totalBids ?? 0}</Text>
            </View>
          </View>

          <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
            <Text className="text-lg font-bold text-[#333F48] mb-4">Resumen de Actividad</Text>
            <View className="flex-row justify-between border-b border-gray-100 pb-3 mb-3">
              <Text className="text-[#A08C79]">Subastas Ganadas</Text>
              <Text className="font-bold text-[#333F48]">{stats?.auctionsWon ?? 0}</Text>
            </View>
            <View className="flex-row justify-between border-b border-gray-100 pb-3 mb-3">
              <Text className="text-[#A08C79]">Total de Pujas</Text>
              <Text className="font-bold text-[#333F48]">{stats?.totalBids ?? 0}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-[#A08C79]">Artículos Vendidos</Text>
              <Text className="font-bold text-[#333F48]">{stats?.itemsSold ?? 0}</Text>
            </View>
          </View>

          {(!stats || (stats.totalBids === 0 && stats.auctionsWon === 0)) && (
            <View className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 items-center py-8">
              <BarChart3 color="#C4B5A5" size={40} />
              <Text className="text-[#333F48] font-bold mt-3">Sin actividad aún</Text>
              <Text className="text-[#A08C79] text-sm text-center mt-1">
                Participá en subastas para ver tus estadísticas aquí.
              </Text>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
