import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, FileText, Building2 } from 'lucide-react-native';
import { apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

interface FilaDetalle { label: string; valor: string; }

function formatearVencimiento(fecha: string | null | undefined, esCheque: boolean): string {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '—';
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const aa = String(d.getUTCFullYear()).slice(-2);
  return esCheque ? `${dd}/${mm}/${aa}` : `${mm}/${aa}`;
}

const Fila = ({ label, valor }: FilaDetalle) => (
  <View className="py-3 border-b border-gray-100 flex-row justify-between items-start">
    <Text className="text-xs text-[#A08C79] flex-1">{label}</Text>
    <Text className="text-sm text-[#333F48] font-medium flex-1 text-right">{valor}</Text>
  </View>
);

export default function DetalleMedioPago() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { token } = useAuth();

  const [metodo, setMetodo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const res = await apiGet(`/pagos/${id}`, token ?? undefined);
        setMetodo(res?.data ?? res);
      } catch (e: any) {
        setError(e.message || 'No se pudo cargar el detalle');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, [id, token]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  if (error || !metodo) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-6">
        <Text className="text-[#A08C79] text-center">{error || 'No encontrado'}</Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-[#6A4F99] font-semibold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const tipoNorm = (metodo.tipo ?? '').toLowerCase();
  const esTarjeta = tipoNorm === 'tarjeta de credito';
  const esCheque = tipoNorm === 'cheque';
  const esCuenta = tipoNorm === 'cuenta bancaria' || tipoNorm === 'transferencia';

  const Icono = esTarjeta ? CreditCard : esCheque ? FileText : Building2;
  const color = esTarjeta ? '#6A4F99' : esCheque ? '#C9A063' : '#4A7C59';

  const titulo = esTarjeta
    ? `Tarjeta ···· ${String(metodo.numero).slice(-4)}`
    : esCheque
    ? `Cheque Nº ${metodo.numero}`
    : esCuenta
    ? 'Cuenta Bancaria'
    : metodo.tipo ?? 'Método de pago';

  const estadoColor =
    metodo.estado === 'verificado' ? '#16a34a' :
    metodo.estado === 'rechazado'  ? '#dc2626' :
    '#6A4F99';

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-12 pb-4 px-4 flex-row items-center border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft color="#333F48" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#333F48]">Detalle</Text>
      </View>

      <ScrollView className="flex-1 px-4 py-4">
        {/* Encabezado */}
        <View className="bg-white rounded-xl border border-gray-200 mb-4 overflow-hidden shadow-sm">
          <View style={{ backgroundColor: color }} className="h-2 w-full" />
          <View className="p-5 flex-row items-center gap-4">
            <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: color + '18' }}>
              <Icono color={color} size={24} />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-bold text-[#333F48]">{titulo}</Text>
              <View className="mt-1 self-start px-2 py-0.5 rounded-full" style={{ backgroundColor: estadoColor + '18' }}>
                <Text className="text-xs font-semibold capitalize" style={{ color: estadoColor }}>{metodo.estado}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Datos */}
        <View className="bg-white rounded-xl border border-gray-200 px-4 mb-4 shadow-sm">
          {metodo.titular ? <Fila label="Titular" valor={metodo.titular} /> : null}

          {esTarjeta && (
            <>
              <Fila label="Número" valor={`···· ···· ···· ${String(metodo.numero).slice(-4)}`} />
              <Fila label="Vencimiento" valor={formatearVencimiento(metodo.vencimiento, false)} />
              <Fila label="Banco emisor" valor={metodo.banco ?? '—'} />
              <Fila label="País" valor={metodo.pais ?? '—'} />
            </>
          )}

          {esCheque && (
            <>
              <Fila label="Número de cheque" valor={metodo.numero} />
              <Fila label="Vencimiento" valor={formatearVencimiento(metodo.vencimiento, true)} />
              <Fila label="Banco" valor={metodo.banco ?? '—'} />
              <Fila label="País" valor={metodo.pais ?? '—'} />
              <Fila
                label="Monto garantía"
                valor={metodo.montoGarantia != null ? `$${Number(metodo.montoGarantia).toLocaleString('es-AR')}` : '—'}
              />
            </>
          )}

          {esCuenta && (
            <>
              <Fila label="CBU" valor={metodo.numero} />
              <Fila label="Alias" valor={metodo.alias ?? '—'} />
              <Fila label="Banco" valor={metodo.banco ?? '—'} />
              <Fila label="País" valor={metodo.pais ?? '—'} />
            </>
          )}
        </View>

        {/* Foto del cheque */}
        {esCheque && metodo.fotoCheque ? (
          <View className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <Text className="text-xs text-[#A08C79] mb-3 font-medium">Foto del Cheque</Text>
            <Image
              source={{ uri: `data:image/jpeg;base64,${metodo.fotoCheque}` }}
              className="w-full rounded-lg"
              style={{ height: 220 }}
              resizeMode="contain"
            />
          </View>
        ) : esCheque ? (
          <View className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm items-center py-8">
            <FileText color="#C4B5A5" size={36} />
            <Text className="text-[#A08C79] text-sm mt-2">Sin foto adjunta</Text>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
