import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, TextInputProps, Alert, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Trash2, Plus, FileText, Building2, Camera, X, ChevronDown, ChevronRight } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { API_BASE_URL, apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';
import { CountryPickerModal } from '@/components/authComponents';
import * as ImagePicker from 'expo-image-picker';

interface Pais { id: number; name: string; }

function formatVenc(fecha: string | null | undefined, esCheque: boolean): string {
  if (!fecha) return '—';
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return '—';
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const aa = String(d.getUTCFullYear()).slice(-2);
  return esCheque ? `${dd}/${mm}/${aa}` : `${mm}/${aa}`;
}

const CampoFormulario = ({ label, className = '', ...props }: { label: string } & TextInputProps) => (
  <View className="mb-3">
    <Text className="text-xs text-[#A08C79] mb-1">{label}</Text>
    <TextInput
      className={`border border-gray-200 rounded-lg p-3 text-[#333F48] ${className}`}
      placeholderTextColor="#C4B5A5"
      {...props}
    />
  </View>
);

export default function PaymentMethods() {
  const router = useRouter();
  const { token } = useAuth();

  const [methods, setMethods] = useState<any[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [showPaisModal, setShowPaisModal] = useState(false);
  const [paisCuentaId, setPaisCuentaId] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [tipo, setTipo] = useState<'tarjeta de credito' | 'cheque' | 'cuenta bancaria' | null>(null);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [titular, setTitular] = useState('');
  const [banco, setBanco] = useState('');
  const [paisCuenta, setPaisCuenta] = useState('');
  const [alias, setAlias] = useState('');
  const [fotoCheque, setFotoCheque] = useState<string | null>(null);
  const [montoGarantia, setMontoGarantia] = useState('');
  const [vencimientoCheque, setVencimientoCheque] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMethods = useCallback(async () => {
    // Países: endpoint público, carga independiente para que no falle con los pagos
    apiGet('/paises').then(res => {
      setPaises(res?.data ?? res ?? []);
    }).catch(() => {});

    if (!token) { setLoading(false); return; }

    try {
      const pagosRes = await apiGet('/pagos', token);
      if (pagosRes?.data) setMethods(pagosRes.data);
    } catch {
      console.warn('Error al obtener medios de pago');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchMethods(); }, [fetchMethods]);

  const formatCardNumber = (value: string) =>
    value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    return digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  };

  const formatearMonto = (input: string): string => {
    const limpio = input.replace(/[^0-9,]/g, '');
    const [entero, decimal] = limpio.split(',');
    const enteroFormateado = entero.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimal !== undefined ? `${enteroFormateado},${decimal.slice(0, 2)}` : enteroFormateado;
  };

  // DD/MM/AA
  const formatFechaCheque = (value: string) => {
    const d = value.replace(/\D/g, '').slice(0, 6);
    if (d.length >= 5) return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
    if (d.length >= 3) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return d;
  };

  const resetForm = () => {
    setTipo(null);
    setCardNumber('');
    setExpiry('');
    setCvc('');
    setTitular('');
    setBanco('');
    setPaisCuenta('');
    setAlias('');
    setFotoCheque(null);
    setMontoGarantia('');
    setVencimientoCheque('');

    setPaisCuentaId(0);
    setPaisCuenta('');
  };

  const tomarFotoCheque = () => {
    Alert.alert('Foto del cheque', '¿Cómo querés cargar la foto?', [
      {
        text: 'Cámara', onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({ mediaTypes: 'images', quality: 0.7 });
          if (!result.canceled && result.assets[0]) setFotoCheque(result.assets[0].uri);
        }
      },
      {
        text: 'Galería', onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            Alert.alert('Permiso requerido', 'Necesitamos acceso a la galería.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: 'images', quality: 0.7 });
          if (!result.canceled && result.assets[0]) setFotoCheque(result.assets[0].uri);
        }
      },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const validarFechaCheque = (fecha: string): string | null => {
    if (!fecha || fecha.length < 8) return null;
    const [dd, mm, aa] = fecha.split('/');
    const dia = parseInt(dd), mes = parseInt(mm), anio = 2000 + parseInt(aa);
    if (mes < 1 || mes > 12) return 'El mes debe estar entre 01 y 12.';
    if (dia < 1 || dia > 31) return 'El día debe estar entre 01 y 31.';
    const fecha2 = new Date(anio, mes - 1, dia);
    if (fecha2.getMonth() !== mes - 1) return 'La fecha ingresada no es válida.';
    return null;
  };

  const handleAdd = async () => {
    if (!cardNumber.trim()) {
      Alert.alert('Error', 'Por favor, ingresá el número o identificador.');
      return;
    }
    if (tipo === 'tarjeta de credito') {
      const raw = cardNumber.replace(/\s/g, '');
      if (raw.length < 16 || expiry.length < 5 || cvc.length < 3) {
        Alert.alert('Error', 'Completá número de tarjeta, vencimiento y CVC.');
        return;
      }
    }
    if (tipo === 'cuenta bancaria' && cardNumber.replace(/\s/g, '').length !== 22) {
      Alert.alert('Error', 'El CBU debe tener exactamente 22 dígitos.');
      return;
    }
    if (tipo === 'cuenta bancaria' && alias && !/^[a-z0-9.\-]{6,20}$/.test(alias)) {
      Alert.alert('Error', 'El alias debe tener entre 6 y 20 caracteres. Solo se permiten letras minúsculas, números, puntos y guiones.');
      return;
    }
    if (tipo === 'cheque' && vencimientoCheque) {
      const errorFecha = validarFechaCheque(vencimientoCheque);
      if (errorFecha) { Alert.alert('Error', errorFecha); return; }
    }

    const paisNombre = paises.find(p => p.id === paisCuentaId)?.name ?? paisCuenta;

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('cardNumber', cardNumber);
      formData.append('cvc', cvc);
      formData.append('tipo', tipo ?? '');
      formData.append('titular', titular);
      formData.append('banco', banco);
      formData.append('pais', paisNombre);
      formData.append('alias', alias);
      if (montoGarantia) formData.append('montoGarantia', montoGarantia.replace(/\./g, '').replace(',', '.'));

      const expiryParaEnviar = tipo === 'cheque' ? vencimientoCheque : expiry;
      if (expiryParaEnviar) formData.append('expiry', expiryParaEnviar);

      if (tipo === 'cheque' && fotoCheque) {
        const filename = fotoCheque.split('/').pop() ?? 'cheque.jpg';
        formData.append('fotoCheque', { uri: fotoCheque, name: filename, type: 'image/jpeg' } as any);
      }

      const res = await fetch(`${API_BASE_URL}/pagos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || `HTTP ${res.status}`);

      Alert.alert('Éxito', 'Método de pago añadido');
      setShowAdd(false);
      resetForm();
      fetchMethods();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo añadir el método de pago');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Eliminar', '¿Querés eliminar este método de pago?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/pagos/${id}`, {
              method: 'DELETE',
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            Alert.alert('Éxito', 'Método de pago eliminado');
            fetchMethods();
          } catch {
            Alert.alert('Error', 'No se pudo eliminar el método de pago');
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="pt-12 pb-4 px-4 flex-row items-center border-b border-gray-200 bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-4">
          <ChevronLeft color="#333F48" size={24} />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-[#333F48]">Medios de Pago</Text>
      </View>

      <KeyboardAwareScrollView className="flex-1 px-4 py-4" keyboardShouldPersistTaps="handled" enableOnAndroid extraScrollHeight={20}>
        {methods.length === 0 && !showAdd ? (
          <View className="items-center justify-center py-10">
            <CreditCard color="#A08C79" size={48} />
            <Text className="text-[#A08C79] text-center mt-4 mb-6">No tenés medios de pago guardados.</Text>
          </View>
        ) : (
          methods.map((m) => {
            const tipoNorm = (m.tipo ?? '').toLowerCase();
            const esTarjeta = tipoNorm === 'tarjeta de credito';
            const esCheque = tipoNorm === 'cheque';
            const esCuenta = tipoNorm === 'cuenta bancaria' || tipoNorm === 'transferencia';
            const Icono = esTarjeta ? CreditCard : esCheque ? FileText : Building2;
            const color = esTarjeta ? '#6A4F99' : esCheque ? '#C9A063' : '#4A7C59';

            const titulo = esTarjeta
              ? `Tarjeta  ···· ${String(m.numero).slice(-4)}`
              : esCheque
              ? `Cheque Nº ${m.numero}`
              : esCuenta
              ? 'Cuenta Bancaria'
              : m.tipo ?? 'Método de pago';

            const estadoColor =
              m.estado === 'verificado' ? '#16a34a' :
              m.estado === 'rechazado'  ? '#dc2626' :
              '#6A4F99';

            return (
              <TouchableOpacity
                key={m.identificador}
                onPress={() => router.push(`/perfil/medios-de-pago/${m.identificador}`)}
                className="bg-white rounded-xl border border-gray-200 mb-3 shadow-sm overflow-hidden"
                activeOpacity={0.85}
              >
                <View style={{ backgroundColor: color }} className="h-1.5 w-full" />
                <View className="p-4 flex-row justify-between items-start">
                  <View className="flex-row items-start flex-1 mr-3">
                    <View className="w-10 h-10 rounded-full items-center justify-center mr-3 mt-0.5" style={{ backgroundColor: color + '18' }}>
                      <Icono color={color} size={20} />
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-[#333F48] mb-1">{titulo}</Text>
                      {m.titular ? <Text className="text-xs text-[#A08C79]">Titular: {m.titular}</Text> : null}
                      {(esTarjeta || esCheque) && m.vencimiento ? <Text className="text-xs text-[#A08C79]">Vence: {formatVenc(m.vencimiento, esCheque)}</Text> : null}
                      {!esTarjeta && m.banco ? <Text className="text-xs text-[#A08C79]">Banco: {m.banco}</Text> : null}
                      {esCuenta && m.numero ? (
                        <Text className="text-xs text-[#A08C79]" numberOfLines={1}>
                          CBU: {`${String(m.numero).slice(0, 6)}···${String(m.numero).slice(-4)}`}
                        </Text>
                      ) : null}
                      {esCuenta && m.alias ? <Text className="text-xs text-[#A08C79]">Alias: {m.alias}</Text> : null}
                      <View className="mt-1.5 self-start px-2 py-0.5 rounded-full" style={{ backgroundColor: estadoColor + '18' }}>
                        <Text className="text-[10px] font-semibold capitalize" style={{ color: estadoColor }}>{m.estado}</Text>
                      </View>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <ChevronRight color="#A08C79" size={18} />
                    <TouchableOpacity onPress={() => handleDelete(String(m.identificador))} className="p-2 bg-red-50 rounded-full">
                      <Trash2 color="#ef4444" size={18} />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        {showAdd && !tipo ? (
          <View className="bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <Text className="font-bold text-[#333F48] mb-4">¿Qué tipo de medio querés agregar?</Text>
            <View className="gap-3">
              {([
                { value: 'tarjeta de credito', label: 'Tarjeta de Crédito' },
                { value: 'cheque', label: 'Cheque' },
                { value: 'cuenta bancaria', label: 'Cuenta Bancaria' },
              ] as const).map((t) => (
                <TouchableOpacity
                  key={t.value}
                  onPress={() => setTipo(t.value)}
                  className="py-3 rounded-lg border border-gray-200 items-center bg-white"
                >
                  <Text className="text-sm font-semibold text-[#333F48]">{t.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={() => setShowAdd(false)} className="py-3 items-center">
                <Text className="text-sm text-[#A08C79]">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : showAdd && tipo ? (
          <View className="bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <Text className="font-bold text-[#333F48] mb-4">
              {tipo === 'tarjeta de credito' ? 'Nueva Tarjeta de Crédito' : tipo === 'cheque' ? 'Nuevo Cheque' : 'Nueva Cuenta Bancaria'}
            </Text>

            {tipo === 'tarjeta de credito' && (
              <>
                <CampoFormulario label="Titular" value={titular} onChangeText={setTitular} placeholder="Nombre del titular" />
                <CampoFormulario
                  label="Número de Tarjeta"
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                  keyboardType="numeric"
                  placeholder="0000 0000 0000 0000"
                  maxLength={19}
                />
                <CampoFormulario
                  label="CVC"
                  value={cvc}
                  onChangeText={(t) => setCvc(t.replace(/\D/g, '').slice(0, 4))}
                  keyboardType="numeric"
                  placeholder="123"
                  maxLength={4}
                  secureTextEntry
                />
                <CampoFormulario
                  label="Vencimiento (MM/AA)"
                  value={expiry}
                  onChangeText={(t) => setExpiry(formatExpiry(t))}
                  keyboardType="numeric"
                  placeholder="MM/AA"
                  maxLength={5}
                />
                <CampoFormulario label="Banco emisor" value={banco} onChangeText={setBanco} placeholder="Ej: Banco Galicia" />
                <View className="mb-3">
                  <Text className="text-xs text-[#A08C79] mb-1">País</Text>
                  <TouchableOpacity
                    onPress={() => setShowPaisModal(true)}
                    className="border border-gray-200 rounded-lg p-3 flex-row items-center justify-between"
                  >
                    <Text style={{ color: paisCuentaId ? '#333F48' : '#C4B5A5' }}>
                      {paisCuentaId ? paises.find(p => p.id === paisCuentaId)?.name : 'Seleccioná un país'}
                    </Text>
                    <ChevronDown color="#A08C79" size={16} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            {tipo === 'cheque' && (
              <>
                <CampoFormulario
                  label="Número de Cheque"
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(t.replace(/\D/g, '').slice(0, 8))}
                  keyboardType="numeric"
                  placeholder="Ej: 00123456"
                  maxLength={8}
                />
                <Text className="text-xs text-[#A08C79] -mt-2 mb-3">El número figura en el frente del cheque físico (8 dígitos).</Text>
                <CampoFormulario label="Banco" value={banco} onChangeText={setBanco} placeholder="Ej: Banco Nación" />
                <CampoFormulario label="Titular" value={titular} onChangeText={setTitular} placeholder="Nombre del titular" />
                <CampoFormulario
                  label="Vencimiento (DD/MM/AA)"
                  value={vencimientoCheque}
                  onChangeText={(t) => setVencimientoCheque(formatFechaCheque(t))}
                  keyboardType="numeric"
                  placeholder="DD/MM/AA"
                  maxLength={8}
                />
                <CampoFormulario
                  label="Monto del cheque ($)"
                  value={montoGarantia}
                  onChangeText={(t) => setMontoGarantia(formatearMonto(t))}
                  keyboardType="decimal-pad"
                  placeholder="Ej: 50.000,00"
                />
                <View className="mb-3">
                  <Text className="text-xs text-[#A08C79] mb-1">País</Text>
                  <TouchableOpacity
                    onPress={() => setShowPaisModal(true)}
                    className="border border-gray-200 rounded-lg p-3 flex-row items-center justify-between"
                  >
                    <Text style={{ color: paisCuentaId ? '#333F48' : '#C4B5A5' }}>
                      {paisCuentaId ? paises.find(p => p.id === paisCuentaId)?.name : 'Seleccioná un país'}
                    </Text>
                    <ChevronDown color="#A08C79" size={16} />
                  </TouchableOpacity>
                </View>
                <View className="mb-3">
                  <Text className="text-xs text-[#A08C79] mb-2">Foto del Cheque</Text>
                  {fotoCheque ? (
                    <View className="relative">
                      <Image source={{ uri: fotoCheque }} className="w-full h-40 rounded-lg" resizeMode="cover" />
                      <TouchableOpacity onPress={() => setFotoCheque(null)} className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                        <X color="white" size={16} />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={tomarFotoCheque}
                      className="border-2 border-dashed border-gray-300 rounded-lg h-28 items-center justify-center gap-2"
                    >
                      <Camera color="#A08C79" size={28} />
                      <Text className="text-sm text-[#A08C79]">Sacar foto del cheque</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </>
            )}

            {tipo === 'cuenta bancaria' && (
              <>
                <CampoFormulario
                  label="CBU (22 dígitos)"
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(t.replace(/\D/g, '').slice(0, 22))}
                  keyboardType="numeric"
                  placeholder="0000000000000000000000"
                  maxLength={22}
                />
                <CampoFormulario
                  label="Alias (6-20 caracteres)"
                  value={alias}
                  onChangeText={(t) => setAlias(t.toLowerCase().replace(/[^a-z0-9.\-]/g, '').slice(0, 20))}
                  placeholder="Ej: mi.alias.banco"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <CampoFormulario label="Banco" value={banco} onChangeText={setBanco} placeholder="Ej: Banco Galicia" />
                <CampoFormulario label="Titular de la Cuenta" value={titular} onChangeText={setTitular} placeholder="Nombre del titular" />
                <View className="mb-3">
                  <Text className="text-xs text-[#A08C79] mb-1">País de la Cuenta</Text>
                  <TouchableOpacity
                    onPress={() => setShowPaisModal(true)}
                    className="border border-gray-200 rounded-lg p-3 flex-row items-center justify-between"
                  >
                    <Text style={{ color: paisCuentaId ? '#333F48' : '#C4B5A5' }}>
                      {paisCuentaId ? paises.find(p => p.id === paisCuentaId)?.name : 'Seleccioná un país'}
                    </Text>
                    <ChevronDown color="#A08C79" size={16} />
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View className="flex-row gap-3 mt-1">
              <Button variant="secondary" className="flex-1" onPress={resetForm}>
                <Text>Cancelar</Text>
              </Button>
              <Button className="flex-1 bg-[#6A4F99]" onPress={handleAdd} disabled={submitting}>
                <Text className="text-white font-bold">{submitting ? 'Guardando...' : 'Guardar'}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setShowAdd(true)} className="mt-4 w-full bg-[#C9A063] h-12 rounded-md flex-row items-center justify-center gap-2">
            <Plus color="white" size={20} />
            <Text className="text-white font-bold">Agregar</Text>
          </TouchableOpacity>
        )}
      </KeyboardAwareScrollView>

      <CountryPickerModal
        visible={showPaisModal}
        onClose={() => setShowPaisModal(false)}
        paises={paises}
        selectedId={paisCuentaId}
        onSelect={(id) => { setPaisCuentaId(id); setShowPaisModal(false); }}
      />
    </View>
  );
}
