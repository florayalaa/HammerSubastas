import React, { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link, useFocusEffect } from 'expo-router';
import { Trophy, TrendingDown, Clock, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/app/lib/api';
import { EncabezadoTab } from '@/components/EncabezadoTab';

type EstadoPuja = 'ganada' | 'perdida' | 'ganando' | 'superada' | 'pendiente';

interface ItemPuja {
  itemId: string;
  auctionId: string;
  titulo: string;
  miMejorPuja: number;
  precioActual: number;
  estado: EstadoPuja;
  auctionTitle: string;
  fechaFin: string | null;
  subastaCerrada: boolean;
}

function resolverEstado(ganador: boolean, subastaCerrada: boolean, miPuja: number, precioActual: number): EstadoPuja {
  if (ganador) return 'ganada';
  if (subastaCerrada) return 'perdida';
  if (miPuja >= precioActual) return 'ganando';
  return 'superada';
}

const ESTADO_CONFIG: Record<EstadoPuja, { label: string; bg: string; text: string; Icon: any; iconColor: string }> = {
  ganada:   { label: 'Ganada',   bg: 'bg-green-100', text: 'text-green-700', Icon: Trophy,       iconColor: '#16a34a' },
  perdida:  { label: 'Perdida',  bg: 'bg-red-100',   text: 'text-red-700',   Icon: TrendingDown, iconColor: '#dc2626' },
  ganando:  { label: 'Ganando',  bg: 'bg-[#6A4F99]/10', text: 'text-[#6A4F99]', Icon: Trophy,   iconColor: '#6A4F99' },
  superada: { label: 'Superada', bg: 'bg-orange-100', text: 'text-orange-700', Icon: TrendingDown, iconColor: '#ea580c' },
  pendiente:{ label: 'Pendiente',bg: 'bg-gray-100',  text: 'text-gray-600',  Icon: Clock,        iconColor: '#6b7280' },
};

export default function Bids() {
  const { token, isAuthenticated } = useAuth();
  const [items, setItems] = useState<ItemPuja[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
    const cargar = async () => {
      setLoading(true);
      try {
        if (!token) return;
        const res = await apiGet('/pujos/mis-pujos', token);
        if (!Array.isArray(res)) return;

        // Por cada catalogItem, nos quedamos con la puja más alta del usuario
        const mapa = new Map<string, ItemPuja>();
        for (const bid of res) {
          const ci = bid.catalogItem;
          if (!ci) continue;
          const subastaCerrada = ci.auctionStatus === 'cerrada' || ci.subastado === 'si';
          const estado = resolverEstado(bid.ganador, subastaCerrada, bid.amount, ci.currentPrice);

          const existing = mapa.get(ci.id);
          if (!existing || bid.amount > existing.miMejorPuja) {
            mapa.set(ci.id, {
              itemId: ci.id,
              auctionId: ci.auctionId,
              titulo: ci.title,
              miMejorPuja: bid.amount,
              precioActual: ci.currentPrice,
              estado,
              auctionTitle: ci.auctionTitle,
              fechaFin: ci.fechaFin,
              subastaCerrada,
            });
          }
        }
        // Ordenar: activas primero, luego cerradas
        const orden: EstadoPuja[] = ['ganando', 'superada', 'pendiente', 'ganada', 'perdida'];
        const lista = Array.from(mapa.values()).sort(
          (a, b) => orden.indexOf(a.estado) - orden.indexOf(b.estado)
        );
        setItems(lista);
      } catch (err) {
        console.warn('Error al obtener pujas:', err);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]));

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-gray-50">
        <EncabezadoTab titulo="Mis Pujas" />
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-gray-500 mb-4 text-center">Iniciá sesión para ver tu historial de pujas.</Text>
          <Link href="/(autenticacion)/iniciar-sesion" asChild>
            <TouchableOpacity className="bg-[#6A4F99] px-6 py-3 rounded-xl">
              <Text className="text-white font-bold">Iniciar Sesión</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50">
        <EncabezadoTab titulo="Mis Pujas" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A4F99" />
        </View>
      </View>
    );
  }

  const activas = items.filter(i => !i.subastaCerrada);
  const cerradas = items.filter(i => i.subastaCerrada);

  return (
    <View className="flex-1 bg-gray-50">
    <EncabezadoTab titulo="Mis Pujas" />
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-[#333F48]">Mis Pujas</Text>
        <Text className="text-sm text-[#A08C79] mt-1">Historial de artículos en los que participaste</Text>
      </View>

      {items.length === 0 ? (
        <View className="items-center justify-center py-16">
          <Clock color="#C4B5A5" size={40} />
          <Text className="text-[#333F48] font-bold mt-3">Sin pujas aún</Text>
          <Text className="text-[#A08C79] text-sm text-center mt-1">Participá en una subasta para ver tu historial aquí.</Text>
        </View>
      ) : (
        <>
          {activas.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-[#A08C79] uppercase tracking-wide mb-3">En curso</Text>
              {activas.map(item => <TarjetaPuja key={item.itemId} item={item} />)}
            </>
          )}

          {cerradas.length > 0 && (
            <>
              <Text className="text-sm font-semibold text-[#A08C79] uppercase tracking-wide mt-4 mb-3">Finalizadas</Text>
              {cerradas.map(item => <TarjetaPuja key={item.itemId} item={item} />)}
            </>
          )}
        </>
      )}

      <View className="h-10" />
    </ScrollView>
    </View>
  );
}

function TarjetaPuja({ item }: { item: ItemPuja }) {
  const cfg = ESTADO_CONFIG[item.estado];
  const { Icon, iconColor } = cfg;
  const cerrada = item.subastaCerrada;

  return (
    <Link href={cerrada ? `/subastas/${item.auctionId}` : `/subastas/en-vivo/${item.auctionId}`} asChild>
      <TouchableOpacity className="bg-white rounded-xl border border-gray-200 mb-3 overflow-hidden">
        {/* Barra de estado */}
        <View className={`h-1 w-full ${item.estado === 'ganada' ? 'bg-green-500' : item.estado === 'perdida' ? 'bg-red-400' : item.estado === 'ganando' ? 'bg-[#6A4F99]' : 'bg-orange-400'}`} />

        <View className="p-4 flex-row items-center gap-3">
          {/* Ícono estado */}
          <View className={`w-10 h-10 rounded-full items-center justify-center ${cfg.bg}`}>
            <Icon color={iconColor} size={18} />
          </View>

          {/* Contenido */}
          <View className="flex-1">
            <Text className="font-semibold text-[#333F48] text-sm" numberOfLines={1}>{item.titulo}</Text>
            <Text className="text-[#A08C79] text-xs" numberOfLines={1}>{item.auctionTitle}</Text>

            <View className="flex-row items-center gap-3 mt-2">
              <View>
                <Text className="text-[10px] text-[#A08C79]">Mi mejor puja</Text>
                <Text className="text-sm font-bold text-[#333F48]">
                  ${Number(item.miMejorPuja).toLocaleString('es-AR')}
                </Text>
              </View>
              {!cerrada && (
                <View>
                  <Text className="text-[10px] text-[#A08C79]">Puja actual</Text>
                  <Text className="text-sm font-bold text-[#333F48]">
                    ${Number(item.precioActual).toLocaleString('es-AR')}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Badge estado + chevron */}
          <View className="items-end gap-2">
            <View className={`px-2 py-1 rounded-full ${cfg.bg}`}>
              <Text className={`text-[10px] font-bold ${cfg.text}`}>{cfg.label}</Text>
            </View>
            <ChevronRight color="#C4B5A5" size={16} />
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
