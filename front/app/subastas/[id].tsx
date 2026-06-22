import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Calendar, MapPin, Package, ChevronLeft, Play, Lock } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { apiGet, apiPost, API_BASE_URL } from '@/app/lib/api';

const PLACEHOLDER = "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80";

export default function DetallSubasta() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { isAuthenticated, token, user } = useAuth();

  const [subasta, setSubasta] = useState<any>(null);
  const [cargando, setCargando] = useState(true);
  const [registrando, setRegistrando] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await apiGet(`/subastas/${id}`);
        setSubasta(data);
      } catch (e) {
        console.warn('Error al cargar subasta:', e);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [id]);

  const handleParticipar = async () => {
    if (!token) return;

    setRegistrando(true);
    try {
      await apiPost(`/subastas/${id}/registrar`, {}, token);
      router.push(`/subastas/en-vivo/${id}`);
    } catch (error: any) {
      const msg = error.body?.error || error.message || error.error || '';
      if (msg.includes('already registered')) {
        router.push(`/subastas/en-vivo/${id}`);
      } else if (msg.includes('método de pago')) {
        Alert.alert('Método de pago requerido', msg, [{ text: 'Entendido' }]);
      } else {
        Alert.alert('Error', msg || 'No se pudo registrar a la subasta');
      }
    } finally {
      setRegistrando(false);
    }
  };

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  if (!subasta) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-[#333F48] text-lg font-bold mb-2">Subasta no encontrada</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-[#6A4F99] underline">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const fecha = new Date(subasta.startDate).toLocaleDateString('es-AR', { timeZone: 'UTC' });
  const hora  = subasta.startTime
    ? new Date(subasta.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' })
    : '';
  const enVivo = subasta.status === 'abierta';
  const items: any[] = subasta.catalogItems ?? [];

  const hoyStr = new Date().toISOString().split('T')[0];
  const inicioStr = new Date(subasta.startDate).toISOString().split('T')[0];
  const haEmpezado = inicioStr <= hoyStr;

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>

      {/* Header */}
      <View className="bg-[#6A4F99] pt-12 pb-8 px-4">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 mb-6">
          <ChevronLeft color="white" size={24} />
          <Text className="text-white text-base">Volver</Text>
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 mb-4 flex-wrap">
          {subasta.category && (
            <View className="px-3 py-1 bg-white/20 rounded-full">
              <Text className="text-white text-xs">{subasta.category}</Text>
            </View>
          )}
          <View className="px-3 py-1 bg-white/20 rounded-full">
            <Text className="text-white text-xs">pesos</Text>
          </View>
          {enVivo && (
            <View className="px-3 py-1 bg-red-500 rounded-full flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 bg-white rounded-full" />
              <Text className="text-white text-xs font-bold">EN VIVO</Text>
            </View>
          )}
        </View>

        <Text className="text-3xl font-bold text-white mb-4">{subasta.title}</Text>

        <View className="space-y-3 mb-6">
          <View className="flex-row items-center gap-2 mb-1">
            <Calendar color="white" size={18} />
            <Text className="text-white">{fecha} • {hora}</Text>
          </View>
          {subasta.location && (
            <View className="flex-row items-center gap-2">
              <MapPin color="white" size={18} />
              <Text className="text-white">{subasta.location}</Text>
            </View>
          )}
        </View>

        {isAuthenticated ? (
          haEmpezado ? (
            <TouchableOpacity
              onPress={handleParticipar}
              disabled={registrando}
              className={`flex-row items-center justify-center gap-2 py-4 rounded-xl mt-2 ${enVivo ? 'bg-red-500' : 'bg-white/20 border border-white/40'}`}
            >
              {registrando ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Play color="white" size={20} />
                  <Text className="text-white font-bold text-lg">
                    {enVivo ? 'Unirse EN VIVO' : 'Participar en Subasta'}
                  </Text>
                </>
              )}
            </TouchableOpacity>
          ) : (
            <View className="mt-2 py-3 px-4 bg-white/10 rounded-xl border border-white/20">
              <Text className="text-white/70 text-center text-sm">Disponible el {fecha}</Text>
            </View>
          )
        ) : (
          <TouchableOpacity
            onPress={() => router.push(`/subastas/en-vivo/${id}`)}
            className="flex-row items-center justify-center gap-2 py-4 rounded-xl bg-gray-600/80 border border-gray-400 mt-2"
          >
            <Play color="white" size={20} />
            <Text className="text-white font-bold text-lg">Entrar como Espectador</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Descripción */}
      {subasta.description && (
        <View className="p-4 bg-white mb-4 border-b border-gray-200">
          <Text className="text-xl font-bold text-[#333F48] mb-2">Descripción</Text>
          <Text className="text-[#A08C79] leading-6">{subasta.description}</Text>
        </View>
      )}

      {/* Catálogo */}
      <View className="px-4 pb-8">
        <View className="flex-row items-center justify-between mb-4 mt-2">
          <Text className="text-xl font-bold text-[#333F48]">Catálogo de Artículos</Text>
          <View className="flex-row items-center gap-1">
            <Package color="#A08C79" size={18} />
            <Text className="text-[#A08C79]">{items.length} art.</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View className="items-center py-10">
            <Text className="text-[#A08C79]">Sin artículos cargados aún</Text>
          </View>
        ) : (
          <View className="gap-6">
            {items.map((item, idx) => (
              <Card key={item.id} className="overflow-hidden border-gray-200">
                <Image
                  source={{ uri: item.image ? `${API_BASE_URL}${item.image}` : PLACEHOLDER }}
                  className="w-full h-56"
                  contentFit="cover"
                />
                <View className="p-5">
                  <Text className="text-xl font-bold text-[#333F48] mb-1">{item.title}</Text>

                  <View className="flex-row justify-between mb-4">
                    <View>
                      <Text className="text-sm text-[#A08C79] mb-1">Precio Base</Text>
                      {isAuthenticated ? (
                        <Text className="text-xl font-bold text-[#C9A063]">
                          ${Number(item.startingPrice).toLocaleString('es-AR')}
                        </Text>
                      ) : (
                        <View className="flex-row items-center gap-1">
                          <Lock color="#A08C79" size={14} />
                          <Link href="/(autenticacion)/iniciar-sesion" asChild>
                            <TouchableOpacity>
                              <Text className="text-[#6A4F99] underline text-sm">Iniciá sesión</Text>
                            </TouchableOpacity>
                          </Link>
                        </View>
                      )}
                    </View>
                    <View className="items-end justify-center">
                      <Text className="text-xs text-[#A08C79]">Lote #{String(idx + 1).padStart(3, '0')}</Text>
                    </View>
                  </View>

                  {item.description ? (
                    <Text className="text-[#A08C79] leading-5" numberOfLines={3}>{item.description}</Text>
                  ) : null}
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
