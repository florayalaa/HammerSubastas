import React, { useState, useRef, useCallback } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { Search, ChevronDown, X, Check } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { apiGet } from '@/app/lib/api';
import { TarjetaSubasta } from '@/components/TarjetaSubasta';
import { EncabezadoTab } from '@/components/EncabezadoTab';

export default function Auctions() {
  const scrollRef = useRef<ScrollView>(null);

  const { isAuthenticated, token } = useAuth();

  const [subastas, setSubastas] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);
  const [monedas, setMonedas] = useState<{ codigo: string; nombre: string }[]>([]);
  const [cargando, setCargando] = useState(true);

  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [monedaSeleccionada, setMonedaSeleccionada] = useState('');
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalMoneda, setModalMoneda] = useState(false);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });

      const cargar = async () => {
        try {
          const [resSubastas, resCats, resMon] = await Promise.all([
            apiGet('/subastas', token ?? undefined),
            apiGet('/subastas/categorias'),
            apiGet('/monedas'),
          ]);

          if (Array.isArray(resSubastas)) {
            const ordenadas = [...resSubastas].sort((a, b) => {
              const fa = new Date(a.startDate ?? a.startTime).getTime();
              const fb = new Date(b.startDate ?? b.startTime).getTime();
              return fa - fb;
            });
            setSubastas(ordenadas.map((a: any) => ({
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
            })));
          }

          if (Array.isArray(resCats)) setCategorias(resCats);
          if (Array.isArray(resMon)) setMonedas(resMon);
        } catch (error) {
          console.warn('Error al obtener subastas:', error);
        } finally {
          setCargando(false);
        }
      };
      cargar();
    }, [token])
  );

  const subastasFiltradas = subastas.filter((s) => {
    const coincideBusqueda = busqueda.trim() === '' ||
      s.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaSeleccionada === '' || s.categoria === categoriaSeleccionada;
    const coincideMoneda = monedaSeleccionada === '' || s.moneda === monedaSeleccionada;
    return coincideBusqueda && coincideCategoria && coincideMoneda;
  });

  const hayFiltros = busqueda !== '' || categoriaSeleccionada !== '' || monedaSeleccionada !== '';

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

  return (
    <View className="flex-1 bg-gray-50">
    <EncabezadoTab titulo="Subastas" />
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-4">
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Subastas Disponibles</Text>
        <Text className="text-[#A08C79]">Explorá todas las subastas activas y próximas</Text>
      </View>

      {/* Panel de filtros */}
      <View className="bg-white rounded-xl border border-gray-200 p-4 mb-4 shadow-sm">
        {/* Búsqueda */}
        <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 h-11 mb-3">
          <Search color="#A08C79" size={16} />
          <TextInput
            value={busqueda}
            onChangeText={setBusqueda}
            placeholder="Buscar subasta..."
            placeholderTextColor="#A08C79"
            className="flex-1 ml-2 text-sm text-[#333F48]"
          />
          {busqueda !== '' && (
            <TouchableOpacity onPress={() => setBusqueda('')}>
              <X color="#A08C79" size={16} />
            </TouchableOpacity>
          )}
        </View>

        <View className="flex-row gap-3">
          {/* Filtro Categoría */}
          <TouchableOpacity
            onPress={() => setModalCategoria(true)}
            className="flex-1 flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 h-11"
          >
            <Text className={`text-sm ${categoriaSeleccionada ? 'text-[#6A4F99] font-semibold' : 'text-[#A08C79]'}`}>
              {categoriaSeleccionada || 'Categoría'}
            </Text>
            <ChevronDown color="#A08C79" size={16} />
          </TouchableOpacity>

          {/* Filtro Moneda */}
          <TouchableOpacity
            onPress={() => setModalMoneda(true)}
            className="flex-1 flex-row items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 h-11"
          >
            <Text className={`text-sm ${monedaSeleccionada ? 'text-[#6A4F99] font-semibold' : 'text-[#A08C79]'}`}>
              {monedaSeleccionada || 'Moneda'}
            </Text>
            <ChevronDown color="#A08C79" size={16} />
          </TouchableOpacity>
        </View>

        {/* Limpiar filtros */}
        {hayFiltros && (
          <TouchableOpacity
            onPress={() => { setBusqueda(''); setCategoriaSeleccionada(''); setMonedaSeleccionada(''); }}
            className="mt-3 flex-row items-center justify-center gap-1"
          >
            <X color="#EE3B3B" size={13} />
            <Text className="text-xs text-[#EE3B3B] font-medium">Limpiar filtros</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text className="text-[#A08C79] mb-4 text-sm">
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

      {/* Modal Categoría */}
      <Modal visible={modalCategoria} transparent animationType="slide" onRequestClose={() => setModalCategoria(false)}>
        <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={() => setModalCategoria(false)} />
        <View className="bg-white rounded-t-3xl px-4 pt-4 pb-8 border-t border-gray-200">
          <Text className="text-base font-bold text-[#333F48] mb-3">Categoría de subasta</Text>
          <FlatList
            data={[{ codigo: '', nombre: 'Todas' }, ...categorias.map(c => ({ codigo: c, nombre: c.charAt(0).toUpperCase() + c.slice(1) }))]}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => {
              const sel = categoriaSeleccionada === item.codigo;
              return (
                <TouchableOpacity
                  onPress={() => { setCategoriaSeleccionada(item.codigo); setModalCategoria(false); }}
                  className={`flex-row items-center justify-between py-3 px-2 border-b border-gray-100 ${sel ? 'bg-[#6A4F99]/5' : ''}`}
                >
                  <Text className={`text-sm ${sel ? 'text-[#6A4F99] font-semibold' : 'text-[#333F48]'}`}>{item.nombre}</Text>
                  {sel && <Check color="#6A4F99" size={16} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>

      {/* Modal Moneda */}
      <Modal visible={modalMoneda} transparent animationType="slide" onRequestClose={() => setModalMoneda(false)}>
        <TouchableOpacity className="flex-1 bg-black/50" activeOpacity={1} onPress={() => setModalMoneda(false)} />
        <View className="bg-white rounded-t-3xl px-4 pt-4 pb-8 border-t border-gray-200">
          <Text className="text-base font-bold text-[#333F48] mb-3">Moneda</Text>
          <FlatList
            data={[{ codigo: '', nombre: 'Todas' }, ...monedas]}
            keyExtractor={(item) => item.codigo}
            renderItem={({ item }) => {
              const sel = monedaSeleccionada === item.codigo;
              return (
                <TouchableOpacity
                  onPress={() => { setMonedaSeleccionada(item.codigo); setModalMoneda(false); }}
                  className={`flex-row items-center justify-between py-3 px-2 border-b border-gray-100 ${sel ? 'bg-[#6A4F99]/5' : ''}`}
                >
                  <Text className={`text-sm ${sel ? 'text-[#6A4F99] font-semibold' : 'text-[#333F48]'}`}>{item.nombre}</Text>
                  {sel && <Check color="#6A4F99" size={16} />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </ScrollView>
    </View>
  );
}
