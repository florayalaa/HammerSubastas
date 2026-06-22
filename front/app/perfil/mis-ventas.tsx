import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ChevronLeft, Package, ImageIcon, Trash2 } from 'lucide-react-native';
import { apiGet, apiDelete, apiPost } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

type Estado = { label: string; color: string; bg: string };

function estadoArticulo(producto: any): Estado {
  const sol = producto.extra_solicitudesVenta;
  if (!sol) return { label: 'Pendiente', color: '#2563eb', bg: '#eff6ff' };
  switch (sol.estado) {
    case 'pendiente':    return { label: 'Pendiente',   color: '#2563eb', bg: '#eff6ff' };
    case 'aprobado':     return { label: 'Aprobado',    color: '#16a34a', bg: '#f0fdf4' };
    case 'rechazado':    return { label: 'Rechazado',   color: '#dc2626', bg: '#fef2f2' };
    case 'a_subastar':   return { label: 'A Subastar',  color: '#d97706', bg: '#fffbeb' };
    case 'en_subasta':   return { label: 'En Subasta',  color: '#C9A063', bg: '#fffbeb' };
    case 'vendido':      return { label: 'Vendido',     color: '#6A4F99', bg: '#f5f3ff' };
    default:             return { label: 'Pendiente',   color: '#2563eb', bg: '#eff6ff' };
  }
}

function mensajeEstado(producto: any, estado: Estado): string {
  const sol = producto.extra_solicitudesVenta;
  switch (estado.label) {
    case 'Pendiente':
      return 'Tu artículo está siendo evaluado por nuestro equipo de expertos. Recibirás una notificación cuando se te asigne un precio base y comisión.';
    case 'Aprobado':
      return `Revisamos tu artículo y te proponemos un precio base de $${sol?.precioBase ?? '-'} con una comisión del ${sol?.comision ?? '-'}%. Aceptá para continuar.`;
    case 'Rechazado':
      return sol?.motivo ? `Tu artículo no fue aceptado. Motivo: ${sol.motivo}` : 'Tu artículo no fue aceptado por nuestro equipo.';
    case 'A Subastar':
      return 'Aceptaste la propuesta. Tu artículo está en espera de ser asignado a una subasta próxima.';
    case 'En Subasta':
      return 'Tu artículo se encuentra actualmente en subasta. Podés seguir las pujas en tiempo real.';
    case 'Vendido':
      return 'La subasta de tu artículo ha finalizado exitosamente. El pago se acreditará en tu cuenta.';
    default:
      return '';
  }
}

export default function MySales() {
  const router = useRouter();
  const { token } = useAuth();
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [eliminando, setEliminando] = useState<number | null>(null);
  const [aceptando, setAceptando] = useState<number | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(useCallback(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: false });
  }, []));

  useEffect(() => {
    const cargar = async () => {
      if (!token) { setLoading(false); return; }
      try {
        const res = await apiGet('/articulos/mis-articulos', token);
        setVentas(res?.data ?? res ?? []);
      } catch {
        setVentas([]);
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [token]);

  const handleAceptarPropuesta = async (id: number) => {
    setAceptando(id);
    try {
      await apiPost(`/articulos/${id}/aceptar-propuesta`, {}, token || '');
      setVentas((prev) => prev.map((v) =>
        v.identificador === id
          ? { ...v, extra_solicitudesVenta: { ...v.extra_solicitudesVenta, estado: 'a_subastar' } }
          : v
      ));
    } catch (e: any) {
      Alert.alert('Error', e.message || 'No se pudo procesar la aceptación.');
    } finally {
      setAceptando(null);
    }
  };

  const handleEliminar = (id: number, titulo: string) => {
    Alert.alert(
      'Eliminar solicitud',
      `¿Seguro que querés eliminar "${titulo}"? Esta acción no se puede deshacer.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar', style: 'destructive', onPress: async () => {
            setEliminando(id);
            try {
              await apiDelete(`/articulos/${id}`, token || '');
              setVentas((prev) => prev.filter((v) => v.identificador !== id));
            } catch (e: any) {
              Alert.alert('Error', e.message || 'No se pudo eliminar el artículo.');
            } finally {
              setEliminando(null);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ backgroundColor: 'white', paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' }}>
        <TouchableOpacity onPress={() => router.replace('/(navegacion)/perfil')} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <ChevronLeft color="#A08C79" size={24} />
          <Text style={{ color: '#A08C79', marginLeft: 4, fontWeight: '500' }}>Ir al Perfil</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#333F48', marginBottom: 2 }}>Mis Ventas</Text>
        <Text style={{ color: '#A08C79', fontSize: 14 }}>Artículos consignados para subasta</Text>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#6A4F99" />
        </View>
      ) : ventas.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View style={{ width: 80, height: 80, backgroundColor: '#f3f4f6', borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Package color="#A08C79" size={32} />
          </View>
          <Text style={{ color: '#333F48', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>Aún no tenés artículos</Text>
          <Text style={{ color: '#A08C79', textAlign: 'center' }}>Los artículos que consignes desde el tab Vender aparecerán aquí.</Text>
        </View>
      ) : (
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 48 }}>
          {ventas.map((venta) => {
            const estado = estadoArticulo(venta);
            const referencia = `#V-${String(venta.identificador).padStart(3, '0')}`;
            return (
              <View key={venta.identificador} style={{ backgroundColor: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 }}>
                {/* Portada */}
                {venta.portada ? (
                  <Image source={{ uri: venta.portada }} style={{ width: '100%', height: 220 }} resizeMode="cover" />
                ) : (
                  <View style={{ width: '100%', height: 180, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
                    <ImageIcon color="#C4B5A5" size={40} />
                    <Text style={{ color: '#C4B5A5', fontSize: 12, marginTop: 8 }}>Sin foto de portada</Text>
                  </View>
                )}

                <View style={{ padding: 16 }}>
                  {/* Referencia + estado */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Text style={{ color: '#A08C79', fontSize: 13 }}>{referencia}</Text>
                    <View style={{ backgroundColor: estado.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 }}>
                      <Text style={{ color: estado.color, fontSize: 12, fontWeight: '600' }}>{estado.label}</Text>
                    </View>
                  </View>

                  {/* Título */}
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1a1a1a', marginBottom: 6 }}>
                    {venta.descripcionCatalogo || 'Artículo sin título'}
                  </Text>

                  {/* Descripción */}
                  {venta.descripcionCompleta ? (
                    <Text style={{ color: '#6b7280', fontSize: 14, lineHeight: 20, marginBottom: 12 }} numberOfLines={3}>
                      {venta.descripcionCompleta}
                    </Text>
                  ) : null}

                  {/* Info box */}
                  <View style={{ backgroundColor: estado.bg, borderRadius: 10, padding: 14 }}>
                    <Text style={{ color: estado.color, fontSize: 13, lineHeight: 19 }}>
                      {mensajeEstado(venta, estado)}
                    </Text>
                  </View>

                  {/* Botón aceptar propuesta — solo si está aprobado */}
                  {estado.label === 'Aprobado' && (
                    <TouchableOpacity
                      onPress={() => handleAceptarPropuesta(venta.identificador)}
                      disabled={aceptando === venta.identificador}
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingVertical: 12, borderRadius: 10, backgroundColor: '#16a34a' }}
                    >
                      {aceptando === venta.identificador
                        ? <ActivityIndicator size="small" color="white" />
                        : <Text style={{ color: 'white', fontWeight: '700', fontSize: 15 }}>Aceptar propuesta</Text>
                      }
                    </TouchableOpacity>
                  )}

                  {/* Botón eliminar solo si está pendiente */}
                  {estado.label === 'Pendiente' && (
                    <TouchableOpacity
                      onPress={() => handleEliminar(venta.identificador, venta.descripcionCatalogo || 'este artículo')}
                      disabled={eliminando === venta.identificador}
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#fca5a5', backgroundColor: '#fff1f2' }}
                    >
                      {eliminando === venta.identificador
                        ? <ActivityIndicator size="small" color="#ef4444" />
                        : <>
                            <Trash2 color="#ef4444" size={16} />
                            <Text style={{ color: '#ef4444', fontWeight: '600', fontSize: 14, marginLeft: 6 }}>Cancelar solicitud</Text>
                          </>
                      }
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}
