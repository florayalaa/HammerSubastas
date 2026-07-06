import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Gavel, HandCoins, DollarSign, ChevronRight } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/app/lib/api';
import { TarjetaSubasta } from '@/components/TarjetaSubasta';
import { EncabezadoTab } from '@/components/EncabezadoTab';

export default function Dashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const [stats, setStats] = React.useState({ pujasTotales: 0, totalInvertido: 0 });
  const [subastas, setSubastas] = React.useState<any[]>([]);
  const [enVivoCount, setEnVivoCount] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  useFocusEffect(useCallback(() => {
    if (!isAuthenticated || !token) return;
    setLoading(true);
    Promise.all([
      apiGet('/usuarios/yo/estadisticas', token),
      apiGet('/subastas', token),
    ])
      .then(([s, resSubastas]) => {
        setStats({ pujasTotales: s.pujasTotales ?? 0, totalInvertido: s.totalInvertido ?? 0 });

        if (Array.isArray(resSubastas)) {
          const ordenadas = [...resSubastas].sort((a, b) =>
            new Date(a.startDate ?? a.startTime).getTime() - new Date(b.startDate ?? b.startTime).getTime()
          );
          const mapped = ordenadas.map((a: any) => ({
            id: a.id,
            titulo: a.title,
            fecha: new Date(a.startDate).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
            hora: a.startTime
              ? new Date(a.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
              : '',
            categoria: a.category || 'comun',
            moneda: a.currency || 'pesos',
            articulos: a.itemsCount ?? 0,
            pujaInicial: a.startingPrice != null
              ? `$${Number(a.startingPrice).toLocaleString('es-AR')}`
              : 'No disponible',
            estado: a.status === 'abierta' ? 'en_vivo' : 'proxima',
            imagen: a.image ?? null,
          }));
          setEnVivoCount(mapped.filter(s => s.estado === 'en_vivo').length);
          setSubastas(mapped.slice(0, 3));
        }
      })
      .catch((e) => { if (e?.status !== 401) console.warn('Error dashboard:', e); })
      .finally(() => setLoading(false));
  }, [isAuthenticated, token]));

  const categoryColors: Record<string, string> = {
    comun: '#A08C79', especial: '#6A4F99', plata: '#9CA3AF', oro: '#C9A063', platino: '#B8A89A',
  };
  const catKey = (user?.category ?? 'comun').toLowerCase();
  const catColor = categoryColors[catKey] ?? categoryColors.comun;
  const catLabel = (user?.category ?? 'Común').charAt(0).toUpperCase() + (user?.category ?? 'común').slice(1).toLowerCase();

  return (
    <View className="flex-1 bg-gray-50">
    <EncabezadoTab titulo="Inicio" />
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>

      {/* Encabezado */}
      <View className="flex-row items-center justify-between mb-5">
        <Text className="text-3xl font-bold text-[#333F48]">Dashboard</Text>
        {user?.category && (
          <View className="px-3 py-1 rounded-full" style={{ backgroundColor: catColor }}>
            <Text className="text-white text-xs font-semibold">Categoría: {catLabel}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color="#6A4F99" className="my-8" />
      ) : (
        <>
          {/* Stat cards — fila */}
          <View className="flex-row gap-3 mb-3">
            <Card className="flex-1 border-gray-200">
              <CardContent className="p-4 pt-4">
                <View className="bg-[#6A4F99] w-10 h-10 rounded-lg items-center justify-center mb-3">
                  <Gavel color="white" size={20} />
                </View>
                <Text className="text-2xl font-bold text-[#333F48] mb-1">{enVivoCount}</Text>
                <Text className="text-xs text-[#A08C79]">En Vivo Ahora</Text>
              </CardContent>
            </Card>
            <Card className="flex-1 border-gray-200">
              <CardContent className="p-4 pt-4">
                <View className="bg-[#C9A063] w-10 h-10 rounded-lg items-center justify-center mb-3">
                  <HandCoins color="white" size={20} />
                </View>
                <Text className="text-2xl font-bold text-[#333F48] mb-1">{stats.pujasTotales}</Text>
                <Text className="text-xs text-[#A08C79]">Participaciones</Text>
              </CardContent>
            </Card>
          </View>

          {/* Total Gastado */}
          <Card className="mb-6 border-gray-200">
            <CardContent className="p-4 pt-4 flex-row items-center gap-4">
              <View className="bg-[#4A7C59] w-10 h-10 rounded-lg items-center justify-center">
                <DollarSign color="white" size={20} />
              </View>
              <View>
                <Text className="text-2xl font-bold text-[#333F48]">
                  ${Number(stats.totalInvertido).toLocaleString('es-AR')}
                </Text>
                <Text className="text-xs text-[#A08C79]">Total Gastado</Text>
              </View>
            </CardContent>
          </Card>

          {/* Subastas Disponibles */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-[#333F48]">Subastas Disponibles</Text>
              <Link href="/(navegacion)/subastas" asChild>
                <TouchableOpacity className="flex-row items-center">
                  <Text className="text-[#6A4F99] mr-1 font-medium">Ver todas</Text>
                  <ChevronRight color="#6A4F99" size={16} />
                </TouchableOpacity>
              </Link>
            </View>

            {subastas.length === 0 ? (
              <Text className="text-[#A08C79] text-sm">No hay subastas disponibles en este momento</Text>
            ) : (
              <View>
                {subastas.map((subasta) => (
                  <TarjetaSubasta
                    key={subasta.id}
                    subasta={subasta}
                    estaAutenticado={isAuthenticated}
                  />
                ))}
              </View>
            )}
          </View>
        </>
      )}

      <View className="h-10" />
    </ScrollView>
    </View>
  );
}
