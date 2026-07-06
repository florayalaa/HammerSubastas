import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Upload, PackagePlus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { apiPost } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';
import { EncabezadoVolver } from '@/components/EncabezadoVolver';

export default function UploadArticle() {
  const router = useRouter();
  const { token } = useAuth();
  
  const [descripcionCatalogo, setDescripcionCatalogo] = useState('');
  const [descripcionCompleta, setDescripcionCompleta] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!descripcionCatalogo.trim() || !descripcionCompleta.trim()) {
      Alert.alert('Error', 'Por favor completa todos los campos para la consignación.');
      return;
    }

    setSubmitting(true);
    try {
      await apiPost('/articulos/enviar', {
        descripcionCatalogo,
        descripcionCompleta
      }, token || '');

      Alert.alert('Éxito', 'Artículo enviado a revisión exitosamente. Te notificaremos cuando se apruebe.', [
        { text: 'OK', onPress: () => router.replace('/perfil/mis-ventas') }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el artículo.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <EncabezadoVolver />

      <ScrollView className="flex-1 px-4 py-4">
        <Text className="text-3xl font-bold text-[#333F48] mb-4">Subir Artículo</Text>
        <View className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-6 items-center">
          <View className="w-16 h-16 bg-[#6A4F99]/10 rounded-full items-center justify-center mb-4">
            <PackagePlus color="#6A4F99" size={32} />
          </View>
          <Text className="text-lg font-bold text-[#333F48] mb-2 text-center">Consigna tu Pieza</Text>
          <Text className="text-sm text-[#A08C79] text-center">
            Nuestros expertos revisarán la información de tu artículo. Si es aprobado, se programará para una subasta.
          </Text>
        </View>

        <View className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6">
          <View className="mb-4">
            <Text className="text-sm font-semibold text-[#333F48] mb-2">Título Breve (Catálogo)</Text>
            <TextInput 
              value={descripcionCatalogo}
              onChangeText={setDescripcionCatalogo}
              placeholder="Ej. Reloj Rolex Vintage 1980"
              className="border border-gray-200 rounded-lg p-3 text-[#333F48] bg-gray-50"
              editable={!submitting}
            />
            <Text className="text-xs text-gray-400 mt-1">Este será el título público en la subasta.</Text>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-[#333F48] mb-2">Descripción Detallada</Text>
            <TextInput 
              value={descripcionCompleta}
              onChangeText={setDescripcionCompleta}
              placeholder="Detalla el estado, historia, materiales..."
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              className="border border-gray-200 rounded-lg p-3 text-[#333F48] bg-gray-50 h-32"
              editable={!submitting}
            />
          </View>

          <View className="mb-4">
            <Text className="text-sm font-semibold text-[#333F48] mb-2">Fotos del Artículo</Text>
            <TouchableOpacity className="border-2 border-dashed border-gray-300 rounded-lg p-6 items-center justify-center bg-gray-50">
              <Upload color="#A08C79" size={24} className="mb-2" />
              <Text className="text-[#A08C79] font-medium">Subir Imágenes (Próximamente)</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button 
          className="bg-[#6A4F99] h-14 flex-row justify-center items-center mb-10" 
          onPress={handleSubmit} 
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Enviar a Revisión</Text>
          )}
        </Button>
      </ScrollView>
    </View>
  );
}
