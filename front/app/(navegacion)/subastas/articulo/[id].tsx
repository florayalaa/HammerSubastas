import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, FlatList, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { apiGet, API_BASE_URL } from '@/app/lib/api';
import { Button } from '@/components/ui/Button';
import { EncabezadoTab } from '@/components/EncabezadoTab';
import { combinarFechaYHora, comoInstanteLocal } from '@/utils/fechasSubasta';

const { width } = Dimensions.get('window');
const PLACEHOLDER = 'https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80';

export default function DetalleArticulo() {
  const { id, subastaId } = useLocalSearchParams<{ id: string; subastaId: string }>();
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [item, setItem] = useState<any>(null);
  const [subasta, setSubasta] = useState<any>(null);
  const [fotos, setFotos] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);
  const [fotoActiva, setFotoActiva] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      try {
        const subastaData = await apiGet(`/subastas/${subastaId}`);
        setSubasta(subastaData);
        const encontrado = (subastaData.catalogItems ?? []).find((it: any) => it.id === id);
        setItem(encontrado ?? null);

        if (encontrado?.productId) {
          const fotoIds: number[] = await apiGet(`/articulos/${encontrado.productId}/fotos`);
          setFotos(fotoIds.map((fid) => `${API_BASE_URL}/articulos/foto/${fid}`));
        }
      } catch (e) {
        console.warn('Error al cargar artículo:', e);
      } finally {
        setCargando(false);
      }
    };
    if (id && subastaId) cargar();
  }, [id, subastaId]);

  const inicioSubasta = combinarFechaYHora(subasta?.startDate, subasta?.startTime);
  const haEmpezado = inicioSubasta ? new Date() >= inicioSubasta : false;
  const finSubasta = comoInstanteLocal(subasta?.endDate);
  const haTerminado = finSubasta ? finSubasta < new Date() : subasta?.status === 'cerrada';
  const puedeParticipar = haEmpezado && !haTerminado;
  const esPropio = !!(item?.ownerId && user?.id && String(user.id) === String(item.ownerId));

  const handlePujar = () => {
    if (!isAuthenticated) {
      router.push('/(autenticacion)/iniciar-sesion');
      return;
    }
    if (!puedeParticipar || esPropio) return;
    router.push({ pathname: '/subastas/en-vivo/[id]', params: { id: subastaId, itemId: id } });
  };

  if (cargando) {
    return (
      <View className="flex-1 bg-gray-50">
        <EncabezadoTab titulo="Subastas" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A4F99" />
        </View>
      </View>
    );
  }

  if (!item) {
    return (
      <View className="flex-1 bg-gray-50">
        <EncabezadoTab titulo="Subastas" />
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-[#333F48] text-lg font-bold mb-2">Artículo no encontrado</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text className="text-[#6A4F99] underline">Volver</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const galeria = fotos.length > 0 ? fotos : [PLACEHOLDER];

  return (
    <View className="flex-1 bg-gray-50">
      <EncabezadoTab titulo="Subastas" />

      <ScrollView contentContainerClassName="pb-32">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center gap-2 px-4 pt-4">
          <ChevronLeft color="#6A4F99" size={20} />
          <Text className="text-[#6A4F99] font-semibold">Volver</Text>
        </TouchableOpacity>

        {/* Galería de fotos */}
        <FlatList
          data={galeria}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(uri, i) => `${uri}-${i}`}
          onMomentumScrollEnd={(e) => {
            const idx = Math.round(e.nativeEvent.contentOffset.x / width);
            setFotoActiva(idx);
          }}
          renderItem={({ item: uri }) => (
            <Image source={{ uri }} style={{ width, height: 320 }} resizeMode="cover" />
          )}
        />

        {galeria.length > 1 && (
          <View className="flex-row justify-center gap-1 mt-2">
            {galeria.map((_, i) => (
              <View
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === fotoActiva ? 'bg-[#6A4F99]' : 'bg-gray-300'}`}
              />
            ))}
          </View>
        )}

        <View className="p-4">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">{item.title}</Text>
          {item.description ? (
            <Text className="text-[#A08C79] leading-6 mb-4">{item.description}</Text>
          ) : null}

          <View className="flex-row items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
            <View>
              <Text className="text-[10px] text-[#A08C79]">Precio Base</Text>
              <Text className="text-[#C9A063] font-bold text-lg">
                ${Number(item.startingPrice).toLocaleString('es-AR')}
              </Text>
            </View>
            <View>
              <Text className="text-[10px] text-[#A08C79]">Puja Actual</Text>
              <Text className="text-[#333F48] font-bold text-lg">
                ${Number(item.currentPrice).toLocaleString('es-AR')}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Acción */}
      <View className="absolute bottom-0 w-full bg-white border-t border-gray-200 p-4 pb-8">
        {isAuthenticated && esPropio && (
          <Text className="text-[#A08C79] text-xs text-center mb-2">
            No podés pujar por tu propio artículo.
          </Text>
        )}
        {isAuthenticated && !esPropio && !puedeParticipar && (
          <Text className="text-[#A08C79] text-xs text-center mb-2">
            {haTerminado
              ? 'Esta subasta ya finalizó.'
              : `Podrás pujar cuando arranque la subasta${inicioSubasta ? `: ${inicioSubasta.toLocaleDateString('es-AR')} ${inicioSubasta.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}` : ''}.`}
          </Text>
        )}
        <Button
          onPress={handlePujar}
          disabled={isAuthenticated && (esPropio || !puedeParticipar)}
          className={`w-full h-14 rounded-xl ${isAuthenticated && (esPropio || !puedeParticipar) ? 'bg-gray-300' : 'bg-[#6A4F99]'}`}
          textClassName="text-white font-bold text-lg"
        >
          {!isAuthenticated
            ? 'Iniciar sesión para pujar'
            : esPropio
            ? 'No podés pujar por tu propio artículo'
            : puedeParticipar
            ? 'Pujar por este artículo'
            : 'Pujas aún no habilitadas'}
        </Button>
      </View>
    </View>
  );
}
