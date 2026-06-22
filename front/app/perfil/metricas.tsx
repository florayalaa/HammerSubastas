import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Trophy, TrendingUp, BarChart3, Calendar, DollarSign } from 'lucide-react-native';
import { apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Metrics() {
  const router = useRouter();
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
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

  const tasaVictoria = stats && stats.pujasTotales > 0
    ? Math.round((stats.pujasGanadas / stats.pujasTotales) * 100)
    : 0;

  const fmt = (n: number) => `$${Number(n).toLocaleString('es-AR')}`;

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
      ) : !stats || stats.pujasTotales === 0 ? (
        <View className="p-6 items-center py-16">
          <BarChart3 color="#C4B5A5" size={48} />
          <Text className="text-[#333F48] font-bold text-lg mt-4">Sin actividad aún</Text>
          <Text className="text-[#A08C79] text-sm text-center mt-2">
            Participá en subastas para ver tus estadísticas aquí.
          </Text>
        </View>
      ) : (
        <View className="p-4 gap-4">

          {/* Tasa de victoria destacada */}
          <View className="bg-[#6A4F99] p-6 rounded-2xl items-center">
            <Trophy color="white" size={32} />
            <Text className="text-white/70 text-sm mt-2">Tasa de Victoria</Text>
            <Text className="text-white text-5xl font-bold mt-1">{tasaVictoria}%</Text>
            <Text className="text-white/60 text-xs mt-1">
              {stats.pujasGanadas} ganadas de {stats.pujasTotales} pujas realizadas
            </Text>
          </View>

          {/* Contadores en 2 columnas */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
              <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-3">
                <TrendingUp color="#16a34a" size={20} />
              </View>
              <Text className="text-[#A08C79] text-xs mb-1">Pujas Totales</Text>
              <Text className="text-2xl font-bold text-[#333F48]">{stats.pujasTotales}</Text>
            </View>

            <View className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
              <View className="w-10 h-10 bg-[#6A4F99]/10 rounded-full items-center justify-center mb-3">
                <Trophy color="#6A4F99" size={20} />
              </View>
              <Text className="text-[#A08C79] text-xs mb-1">Pujas Ganadas</Text>
              <Text className="text-2xl font-bold text-[#333F48]">{stats.pujasGanadas}</Text>
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1 bg-white p-4 rounded-xl border border-gray-200">
              <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mb-3">
                <Calendar color="#3b82f6" size={20} />
              </View>
              <Text className="text-[#A08C79] text-xs mb-1">Subastas Asistidas</Text>
              <Text className="text-2xl font-bold text-[#333F48]">{stats.subastasAsistidas}</Text>
            </View>

            <View className="flex-1 bg-[#C9A063] p-4 rounded-xl">
              <View className="w-10 h-10 bg-white/20 rounded-full items-center justify-center mb-3">
                <DollarSign color="white" size={20} />
              </View>
              <Text className="text-white/80 text-xs mb-1">Total Invertido</Text>
              <Text className="text-lg font-bold text-white" numberOfLines={1}>
                {fmt(stats.totalInvertido)}
              </Text>
            </View>
          </View>

          {/* Detalle */}
          <View className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <View className="px-5 py-4 border-b border-gray-100">
              <Text className="text-base font-bold text-[#333F48]">Desglose</Text>
            </View>

            <View className="px-5 py-3 flex-row justify-between border-b border-gray-100">
              <Text className="text-[#A08C79]">Total ofertado (todas las pujas)</Text>
              <Text className="font-bold text-[#333F48]">{fmt(stats.totalOfertado)}</Text>
            </View>

            <View className="px-5 py-3 flex-row justify-between border-b border-gray-100">
              <Text className="text-[#A08C79]">Total invertido (solo ganadas)</Text>
              <Text className="font-bold text-[#C9A063]">{fmt(stats.totalInvertido)}</Text>
            </View>

            <View className="px-5 py-3 flex-row justify-between border-b border-gray-100">
              <Text className="text-[#A08C79]">Pujas ganadas</Text>
              <Text className="font-bold text-[#333F48]">{stats.pujasGanadas}</Text>
            </View>

            <View className="px-5 py-3 flex-row justify-between border-b border-gray-100">
              <Text className="text-[#A08C79]">Pujas totales</Text>
              <Text className="font-bold text-[#333F48]">{stats.pujasTotales}</Text>
            </View>

            <View className="px-5 py-3 flex-row justify-between">
              <Text className="text-[#A08C79]">Subastas asistidas</Text>
              <Text className="font-bold text-[#333F48]">{stats.subastasAsistidas}</Text>
            </View>
          </View>

        </View>
      )}
      <View className="h-8" />
    </ScrollView>
  );
}
