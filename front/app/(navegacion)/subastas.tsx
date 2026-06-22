import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/app/lib/api';
import { TarjetaSubasta } from '@/components/TarjetaSubasta';

export default function Auctions() {
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const { isAuthenticated, token } = useAuth();
  const [subastas, setSubastas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const obtenerSubastas = async () => {
      try {
        const res = await apiGet('/subastas', token ?? undefined);
        if (res && Array.isArray(res)) {
          const subastasFormateadas = res.map((a: any) => ({
            id: a.id,
            titulo: a.title,
            fecha: new Date(a.startDate).toLocaleDateString('es-AR', { timeZone: 'UTC' }),
            hora: a.startTime ? new Date(a.startTime).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) : '',
            categoria: a.category || "comun",
            moneda: a.currency || "pesos",
            articulos: a.itemsCount ?? 0,
            pujaInicial: a.startingPrice != null
              ? `$${Number(a.startingPrice).toLocaleString('es-AR')}`
              : 'No disponible',
            estado: a.status === 'abierta' ? 'en_vivo' : 'proxima',
            imagen: a.image ?? null,
          }));
          console.warn('[subastas] imágenes:', subastasFormateadas.map(s => `${s.titulo}: ${s.imagen}`));
          setSubastas(subastasFormateadas);
        }
      } catch (error) {
        console.warn("Error al obtener subastas:", error);
      } finally {
        setCargando(false);
      }
    };
    obtenerSubastas();
  }, []);

  const subastasFiltradas = subastas;

  if (cargando) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  return (
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Subastas Disponibles</Text>
        <Text className="text-[#A08C79]">Explora todas las subastas activas y próximas</Text>
      </View>

<Text className="text-[#A08C79] mb-4">
        Mostrando <Text className="font-semibold text-[#333F48]">{subastasFiltradas.length}</Text> subastas
      </Text>

      {subastasFiltradas.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-[#A08C79] text-lg">No se encontraron subastas</Text>
        </View>
      ) : (
        <View className="mb-8">
          {subastasFiltradas.map((subasta) => (
            <TarjetaSubasta 
              key={subasta.id} 
              subasta={subasta} 
              estaAutenticado={isAuthenticated} 
            />
          ))}
        </View>
      )}
      <View className="h-10" />
    </ScrollView>
  );
}