import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Mail, MapPin, FileText, Upload } from 'lucide-react-native';
import { apiPost, apiGet } from '@/app/lib/api'; // Importamos apiGet para los países
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy'; // Para convertir imágenes a Base64 de forma nativa
import { Picker } from '@react-native-picker/picker';

// Definición de tipo para tipar los países del backend
interface Country {
  id: number;
  name: string;
}

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: '',
  });

  const [countries, setCountries] = useState<Country[]>([]); // Estado para los países reales
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [documentFront, setDocumentFront] = useState<string | null>(null);
  const [documentBack, setDocumentBack] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🚀 1. Cargar la lista de países real desde el backend al montar la pantalla
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await apiGet('/countries');
        // Suponiendo que el backend devuelve { status: 'success', data: [...] }
        if (response && response.data) {
          setCountries(response.data);
        }
      } catch (error) {
        console.error("Error al cargar países:", error);
      } finally {
        setLoadingCountries(false);
      }
    }
    fetchCountries();
  }, []);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Helper para leer el archivo local del celular y transformarlo a Base64 string puro
  const convertToBase64 = async (uri: string): Promise<string> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: 'base64' as any,
      });
      return base64;
    } catch (error) {
      console.error("Error convirtiendo imagen a base64:", error);
      throw new Error("No se pudo procesar la imagen del documento.");
    }
  };

  const handleDocumentPick = async (side: 'front' | 'back') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Bajamos un toque la calidad a 0.7 para no saturar el ancho de banda con Base64 gigantes
    });

    if (result && !result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      side === 'front' ? setDocumentFront(uri) : setDocumentBack(uri);
    }
  };

  const handleRegisterSubmit = async () => {
    // Validaciones básicas de UX antes de disparar el cargando
    if (!documentFront || !documentBack) {
      const msg = "Debes subir ambas fotos del DNI para continuar.";
      typeof window !== 'undefined' ? window.alert(msg) : Alert.alert("Campos incompletos", msg);
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.country) {
      const msg = "Por favor, completa todos los campos del formulario.";
      typeof window !== 'undefined' ? window.alert(msg) : Alert.alert("Campos incompletos", msg);
      return;
    }

    setShowConfirmModal(false);
    setIsSubmitting(true);

    try {
      // 🚀 2. Conversión asíncrona de los URIs locales a Base64 antes de despachar
      const frontBase64 = await convertToBase64(documentFront);
      const backBase64 = await convertToBase64(documentBack);

      // 🚀 3. Estructuramos el payload final exacto como lo valida el Zod del Backend
      const payload = {
        ...formData,
        documentFront: frontBase64,
        documentBack: backBase64,
      };

      await apiPost('/auth/register', payload);

      const successMsg = "Tu postulación entró en revisión. Si eres admitido, recibirás tus credenciales provisorias por email.";
      if (typeof window !== 'undefined') {
        window.alert("¡Registro Recibido! " + successMsg);
      } else {
        Alert.alert("¡Registro Recibido!", successMsg);
      }
      
      // Lo mandamos al Login común, ya que ahí detectará si le pide cambio obligatorio o no
      router.push('/(auth)/login'); 
    } catch (error: any) {
      const errorMsg = error.message || "Ocurrió un error inesperado al procesar tu solicitud.";
      if (typeof window !== 'undefined') {
        window.alert("Error en el registro: " + errorMsg);
      } else {
        Alert.alert("Error en el registro", errorMsg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-8">
      <View className="w-full max-w-lg self-center">
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">Crear Cuenta</Text>
          <Text className="text-sm text-[#A08C79]">Completa tus datos para registrarte como postor</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Fila Nombre y Apellido */}
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-700 mb-2">Nombre</Text>
              <View className="relative justify-center">
                <View className="absolute left-3 z-10"><User color="#A08C79" size={18} /></View>
                <Input
                  className="pl-9" containerClassName="mb-0"
                  value={formData.firstName} onChangeText={(t) => updateFormData('firstName', t)}
                  placeholder="Juan" editable={!isSubmitting}
                />
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-700 mb-2">Apellido</Text>
              <View className="relative justify-center">
                <View className="absolute left-3 z-10"><User color="#A08C79" size={18} /></View>
                <Input
                  className="pl-9" containerClassName="mb-0"
                  value={formData.lastName} onChangeText={(t) => updateFormData('lastName', t)}
                  placeholder="Pérez" editable={!isSubmitting}
                />
              </View>
            </View>
          </View>

          {/* Correo Electrónico */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Correo Electrónico</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10"><Mail color="#A08C79" size={18} /></View>
              <Input
                className="pl-9" containerClassName="mb-0"
                value={formData.email} onChangeText={(t) => updateFormData('email', t)}
                placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none"
                editable={!isSubmitting}
              />
            </View>
          </View>

          {/* Domicilio Legal */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Domicilio Legal</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10"><MapPin color="#A08C79" size={18} /></View>
              <Input
                className="pl-9" containerClassName="mb-0"
                value={formData.address} onChangeText={(t) => updateFormData('address', t)}
                placeholder="Calle, número, ciudad" editable={!isSubmitting}
              />
            </View>
          </View>

          {/* País de Origen dinámico */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">País de Origen</Text>
            <View className="relative justify-center border border-slate-200 rounded-lg h-12 overflow-hidden bg-white">
              <View className="absolute left-3 z-10"><FileText color="#A08C79" size={18} /></View>
              <View className="pl-9 w-full justify-center">
                {loadingCountries ? (
                  <ActivityIndicator size="small" color="#6A4F99" className="self-start pl-4" />
                ) : (
                  <Picker
                    selectedValue={formData.country}
                    onValueChange={(itemValue) => updateFormData('country', itemValue)}
                    style={{ width: '100%', height: '100%', color: formData.country ? '#333F48' : '#9CA3AF' }}
                    dropdownIconColor="#A08C79"
                    enabled={!isSubmitting}
                  >
                    <Picker.Item label="Selecciona un país" value="" color="#9CA3AF" />
                    {countries.map((country) => (
                      <Picker.Item key={country.id} label={country.name} value={country.name} />
                    ))}
                  </Picker>
                )}
              </View>
            </View>
          </View>

          {/* Carga de DNI */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">Foto del Documento</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleDocumentPick('front')}
                disabled={isSubmitting}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 items-center justify-center bg-slate-50"
              >
                <Upload color="#A08C79" size={20} className="mb-1" />
                <Text className="text-xs text-[#A08C79] text-center" numberOfLines={1}>
                  {documentFront ? "✓ Frente Cargado" : "Frente DNI"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDocumentPick('back')}
                disabled={isSubmitting}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 items-center justify-center bg-slate-50"
              >
                <Upload color="#A08C79" size={20} className="mb-1" />
                <Text className="text-xs text-[#A08C79] text-center" numberOfLines={1}>
                  {documentBack ? "✓ Dorso Cargado" : "Dorso DNI"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Button 
            onPress={() => setShowConfirmModal(true)} 
            disabled={isSubmitting}
            className="w-full bg-[#6A4F99] rounded-lg h-12"
          >
            {isSubmitting ? <ActivityIndicator color="#fff" /> : "Crear Cuenta"}
          </Button>

          <View className="mt-4 flex-row justify-center">
            <Text className="text-sm text-[#A08C79]">¿Ya tienes una cuenta? </Text>
            <Link href="/(auth)/login" asChild>
              <Text className="text-[#6A4F99] font-semibold">Inicia sesión aquí</Text>
            </Link>
          </View>
        </View>

        {/* Modal de Confirmación */}
        <Modal visible={showConfirmModal} transparent animationType="fade">
          <View className="flex-1 bg-black/50 justify-center px-4">
            <View className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm self-center">
              <Text className="text-xl font-bold text-[#333F48] mb-4">Confirmar Envío</Text>
              <Text className="text-sm text-[#A08C79] mb-6 leading-relaxed">
                ¿Estás seguro de que deseas enviar estos datos? Tu documentación entrará en etapa de validación por la administración.
              </Text>
              <View className="flex-row gap-3">
                <Button variant="secondary" onPress={() => setShowConfirmModal(false)} className="flex-1 h-12">
                  Revisar
                </Button>
                <Button onPress={handleRegisterSubmit} className="flex-1 h-12 bg-[#6A4F99]">
                  Confirmar
                </Button>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}