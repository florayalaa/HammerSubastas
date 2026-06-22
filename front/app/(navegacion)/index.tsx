import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Gavel, HandCoins, ChevronRight } from 'lucide-react-native';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/app/lib/api';
import { TarjetaSubasta } from '@/components/TarjetaSubasta';

export default function Dashboard() {
  const { isAuthenticated, token, user } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const [activeAuctions, setActiveAuctions] = React.useState<any[]>([]);
  const [stats, setStats] = React.useState({ totalBids: 0, auctionsWon: 0 });
  const [recentBids, setRecentBids] = React.useState<any[]>([]);
  const [loadingStats, setLoadingStats] = React.useState(false);

  React.useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const data = await apiGet('/subastas', token ?? undefined);
        if (Array.isArray(data)) {
          const mapped = data.map((a: any) => ({
            id: a.id,
            titulo: a.title,
            fecha: new Date(a.startDate).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
            hora: a.startTime ? new Date(a.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '',
            categoria: a.category || 'comun',
            moneda: a.currency || 'pesos',
            articulos: a.itemsCount ?? 0,
            pujaInicial: a.startingPrice != null
              ? `$${Number(a.startingPrice).toLocaleString('es-AR')}`
              : 'No disponible',
            estado: a.status === 'abierta' ? 'en_vivo' : 'proxima',
            imagen: a.image ?? null,
          }));
          setActiveAuctions(mapped.slice(0, 3));
        }
      } catch (e) {
        console.warn("Error al obtener subastas", e);
      }
    };
    fetchAuctions();
  }, [token]);

  React.useEffect(() => {
    if (!isAuthenticated || !token) return;
    setLoadingStats(true);
    Promise.all([
      apiGet('/usuarios/yo/estadisticas', token),
      apiGet('/pujos/mis-pujos', token),
    ])
      .then(([statsData, bidsData]) => {
        setStats({ totalBids: statsData.totalBids ?? 0, auctionsWon: statsData.auctionsWon ?? 0 });
        setRecentBids(Array.isArray(bidsData) ? bidsData.slice(0, 3) : []);
      })
      .catch((e) => { if (e?.status !== 401) console.warn("Error al obtener estadísticas", e); })
      .finally(() => setLoadingStats(false));
  }, [isAuthenticated, token]);

  return (
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>

      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-[#333F48]">
            {isAuthenticated ? `Hola, ${user?.firstName}` : 'Inicio'}
          </Text>
        </View>
        {isAuthenticated && user?.category && (
          <View className="px-3 py-1 bg-[#C9A063] rounded-full">
            <Text className="text-white text-xs font-semibold">Categoría: {user.category}</Text>
          </View>
        )}
      </View>

      {isAuthenticated && (
        <>
          {loadingStats ? (
            <ActivityIndicator color="#6A4F99" className="mb-6" />
          ) : (
            <View className="flex-row gap-3 mb-6">
              <Card className="flex-1 border-gray-200">
                <CardContent className="p-4 pt-4">
                  <View className="bg-[#6A4F99] w-10 h-10 rounded-lg items-center justify-center mb-3">
                    <Gavel color="white" size={20} />
                  </View>
                  <Text className="text-2xl font-bold text-[#333F48] mb-1">{stats.totalBids}</Text>
                  <Text className="text-xs text-[#A08C79]">Participaciones</Text>
                </CardContent>
              </Card>
              <Card className="flex-1 border-gray-200">
                <CardContent className="p-4 pt-4">
                  <View className="bg-[#C9A063] w-10 h-10 rounded-lg items-center justify-center mb-3">
                    <HandCoins color="white" size={20} />
                  </View>
                  <Text className="text-2xl font-bold text-[#333F48] mb-1">{stats.auctionsWon}</Text>
                  <Text className="text-xs text-[#A08C79]">Subastas Ganadas</Text>
                </CardContent>
              </Card>
            </View>
          )}
        </>
      )}

      {/* Listado de Subastas Activas Integrado con la Tarjeta Estilizada */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-[#333F48]">Subastas Activas</Text>
          <Link href="/(navegacion)/subastas" asChild>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#6A4F99] mr-1 font-medium">Ver todas</Text>
              <ChevronRight color="#6A4F99" size={16} />
            </TouchableOpacity>
          </Link>
        </View>

        {activeAuctions.length === 0 ? (
          <Text className="text-[#A08C79] text-sm">No hay subastas disponibles</Text>
        ) : (
          <View>
            {activeAuctions.map((subasta) => (
              <TarjetaSubasta 
                key={subasta.id} 
                subasta={subasta} 
                estaAutenticado={isAuthenticated} 
              />
            ))}
          </View>
        )}
      </View>

      {/* Historial de Pujas Recientes */}
      {isAuthenticated && (
        <View className="mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold text-[#333F48]">Pujas Recientes</Text>
            <Link href="/(navegacion)/pujas" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-[#6A4F99] mr-1 font-medium">Historial</Text>
                <ChevronRight color="#6A4F99" size={16} />
              </TouchableOpacity>
            </Link>
          </View>

          {recentBids.length === 0 ? (
            <Text className="text-[#A08C79] text-sm">Todavía no realizaste ninguna puja</Text>
          ) : (
            <Card className="border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {recentBids.map((bid) => (
                <View key={bid.id} className="p-4 flex-row justify-between items-center">
                  <View className="flex-1 mr-4">
                    <Text className="text-sm font-medium text-[#333F48] mb-1" numberOfLines={1}>
                      {bid.catalogItem?.auctionTitle ?? 'Subasta'}
                    </Text>
                    <Text className="text-xs text-[#A08C79]">{bid.catalogItem?.title ?? ''}</Text>
                  </View>
                  <Text className="text-sm font-bold text-[#333F48]">${bid.amount}</Text>
                </View>
              ))}
            </Card>
          )}
        </View>
      )}

      <View className="h-10" />
    </ScrollView>
  );
}