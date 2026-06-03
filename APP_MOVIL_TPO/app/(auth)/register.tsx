import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Mail, MapPin, FileText, Upload, X } from 'lucide-react-native';
import { apiPost } from '@/app/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    country: '',
  });

  const [documentFront, setDocumentFront] = useState<string | null>(null);
  const [documentBack, setDocumentBack] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDocumentPick = async (side: 'front' | 'back') => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // Use MediaTypeOptions for cross‑platform compatibility (works on web and native)
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result && !result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        side === 'front' ? setDocumentFront(uri) : setDocumentBack(uri);
      }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-8">
      <View className="w-full max-w-lg self-center">
        <View className="items-center mb-6">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">Crear Cuenta</Text>
          <Text className="text-sm text-[#A08C79]">Completa tus datos para registrarte</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <View className="flex-row gap-4 mb-4">
            <View className="flex-1">
              <Text className="text-sm font-medium text-slate-700 mb-2">Nombre</Text>
              <View className="relative justify-center">
                <View className="absolute left-3 z-10"><User color="#A08C79" size={18} /></View>
                <Input
                  className="pl-9" containerClassName="mb-0"
                  value={formData.firstName} onChangeText={(t) => updateFormData('firstName', t)}
                  placeholder="Juan"
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
                  placeholder="Pérez"
                />
              </View>
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Correo Electrónico</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10"><Mail color="#A08C79" size={18} /></View>
              <Input
                className="pl-9" containerClassName="mb-0"
                value={formData.email} onChangeText={(t) => updateFormData('email', t)}
                placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Domicilio Legal</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10"><MapPin color="#A08C79" size={18} /></View>
              <Input
                className="pl-9" containerClassName="mb-0"
                value={formData.address} onChangeText={(t) => updateFormData('address', t)}
                placeholder="Calle, número, ciudad"
              />
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">País de Origen</Text>
            <View className="relative justify-center border border-slate-200 rounded-lg h-12 overflow-hidden bg-white">
              <View className="absolute left-3 z-10"><FileText color="#A08C79" size={18} /></View>
              <View className="pl-9 w-full">
                <Picker
                  selectedValue={formData.country}
                  onValueChange={(itemValue) => updateFormData('country', itemValue)}
                  style={{ width: '100%', height: '100%', color: formData.country ? '#333F48' : '#9CA3AF' }}
                  dropdownIconColor="#A08C79"
                >
                  <Picker.Item label="Selecciona un país" value="" color="#9CA3AF" />
                  <Picker.Item label="Argentina" value="Argentina" />
                  <Picker.Item label="Bolivia" value="Bolivia" />
                  <Picker.Item label="Brasil" value="Brasil" />
                  <Picker.Item label="Chile" value="Chile" />
                  <Picker.Item label="Colombia" value="Colombia" />
                  <Picker.Item label="Ecuador" value="Ecuador" />
                  <Picker.Item label="Paraguay" value="Paraguay" />
                  <Picker.Item label="Perú" value="Perú" />
                  <Picker.Item label="Uruguay" value="Uruguay" />
                  <Picker.Item label="Venezuela" value="Venezuela" />
                </Picker>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">Foto del Documento</Text>
            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={() => handleDocumentPick('front')}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 items-center justify-center"
              >
                <Upload color="#A08C79" size={20} className="mb-1" />
                {documentFront ? (
                  <View className="items-center flex-row">
                    <Text className="text-xs text-[#333F48] font-medium" numberOfLines={1}>{documentFront}</Text>
                  </View>
                ) : (
                  <Text className="text-xs text-[#A08C79]">Frente DNI</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDocumentPick('back')}
                className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-3 items-center justify-center"
              >
                <Upload color="#A08C79" size={20} className="mb-1" />
                {documentBack ? (
                  <View className="items-center flex-row">
                    <Text className="text-xs text-[#333F48] font-medium" numberOfLines={1}>{documentBack}</Text>
                  </View>
                ) : (
                  <Text className="text-xs text-[#A08C79]">Dorso DNI</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Button onPress={() => setShowConfirmModal(true)} className="w-full bg-[#6A4F99] rounded-lg h-12">
            Crear Cuenta
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
                ¿Estás seguro de que deseas enviar estos datos? Una vez enviados, no podrás modificarlos.
              </Text>
              <View className="flex-row gap-3">
                <Button
                  variant="secondary"
                  onPress={() => setShowConfirmModal(false)}
                  className="flex-1 h-12"
                >
                  Revisar
                </Button>
                <Button
                  onPress={async () => {
                    setShowConfirmModal(false);
                    try {
                      await apiPost('/auth/register', formData);
                      if (typeof window !== 'undefined') {
                        window.alert("Registro Exitoso. Tus datos han sido enviados. Busca el código temporal en la consola del backend.");
                      } else {
                        Alert.alert("Registro Exitoso", "Tus datos han sido enviados. Busca el código temporal en la consola del backend.");
                      }
                      router.push('/(auth)/complete-registration');
                    } catch (error: any) {
                      const errorMsg = error.message || "Ocurrió un error al registrarse";
                      if (typeof window !== 'undefined') {
                        window.alert("Error en el registro: " + errorMsg);
                      } else {
                        Alert.alert("Error en el registro", errorMsg);
                      }
                    }
                  }}
                  className="flex-1 h-12 bg-[#6A4F99]"
                >
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
