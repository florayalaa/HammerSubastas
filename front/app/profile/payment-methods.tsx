import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Trash2, Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { apiGet, apiPost } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PaymentMethods() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMethods = useCallback(async () => {
    try {
      if (!token) return;
      const res = await apiGet('/pagos', token);
      if (res && res.data) {
        setMethods(res.data);
      }
    } catch (error) {
      console.error('Error fetching payments', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  const handleAdd = async () => {
    if (cardNumber.length < 13 || expiry.length < 4 || cvc.length < 3) {
      Alert.alert('Error', 'Por favor, completa todos los campos correctamente.');
      return;
    }

    setSubmitting(true);
    try {
      await apiPost('/pagos', { cardNumber, expiry, cvc }, token || '');
      Alert.alert('Éxito', 'Método de pago añadido');
      setShowAdd(false);
      setCardNumber('');
      setExpiry('');
      setCvc('');
      fetchMethods();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo añadir el método de pago');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000'}/api/payments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Error al eliminar');
      Alert.alert('Éxito', 'Método de pago eliminado');
      fetchMethods();
    } catch {
      Alert.alert('Error', 'No se pudo eliminar el método de pago');
    }
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

      <ScrollView className="flex-1 px-4 py-4">
        {methods.length === 0 && !showAdd ? (
          <View className="items-center justify-center py-10">
            <CreditCard color="#A08C79" size={48} className="mb-4" />
            <Text className="text-[#A08C79] text-center mb-6">No tienes medios de pago guardados.</Text>
          </View>
        ) : (
          methods.map((m) => (
            <View key={m.id} className="bg-white p-4 rounded-xl border border-gray-200 mb-3 flex-row justify-between items-center shadow-sm">
              <View className="flex-row items-center">
                <View className="w-10 h-10 bg-[#6A4F99]/10 rounded-full items-center justify-center mr-3">
                  <CreditCard color="#6A4F99" size={20} />
                </View>
                <View>
                  <Text className="font-bold text-[#333F48]">Tarjeta guardada</Text>
                  <Text className="text-xs text-[#A08C79]">Termina en **** {m.id.substring(m.id.length - 4)}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDelete(m.id)} className="p-2 bg-red-50 rounded-full">
                <Trash2 color="#ef4444" size={18} />
              </TouchableOpacity>
            </View>
          ))
        )}

        {showAdd ? (
          <View className="bg-white p-4 rounded-xl border border-gray-200 mt-4 shadow-sm">
            <Text className="font-bold text-[#333F48] mb-4">Nueva Tarjeta</Text>
            
            <View className="mb-3">
              <Text className="text-xs text-[#A08C79] mb-1">Número de Tarjeta</Text>
              <TextInput 
                value={cardNumber}
                onChangeText={setCardNumber}
                keyboardType="numeric"
                placeholder="0000 0000 0000 0000"
                className="border border-gray-200 rounded-lg p-3 text-[#333F48]"
              />
            </View>

            <View className="flex-row gap-3 mb-4">
              <View className="flex-1">
                <Text className="text-xs text-[#A08C79] mb-1">Vencimiento</Text>
                <TextInput 
                  value={expiry}
                  onChangeText={setExpiry}
                  placeholder="MM/AA"
                  className="border border-gray-200 rounded-lg p-3 text-[#333F48]"
                />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-[#A08C79] mb-1">CVC</Text>
                <TextInput 
                  value={cvc}
                  onChangeText={setCvc}
                  keyboardType="numeric"
                  placeholder="123"
                  className="border border-gray-200 rounded-lg p-3 text-[#333F48]"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <Button variant="secondary" className="flex-1" onPress={() => setShowAdd(false)}>
                <Text>Cancelar</Text>
              </Button>
              <Button className="flex-1 bg-[#6A4F99]" onPress={handleAdd} disabled={submitting}>
                <Text className="text-white font-bold">{submitting ? 'Guardando...' : 'Guardar'}</Text>
              </Button>
            </View>
          </View>
        ) : (
          <Button className="mt-4 bg-[#C9A063] flex-row items-center justify-center gap-2" onPress={() => setShowAdd(true)}>
            <Plus color="white" size={20} />
            <Text className="text-white font-bold">Agregar Método de Pago</Text>
          </Button>
        )}
      </ScrollView>
    </View>
  );
}
