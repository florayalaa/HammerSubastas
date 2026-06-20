import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { User, Mail, MapPin, FileText, Upload, ChevronDown } from 'lucide-react-native';
import { apiGet, apiPostFormData } from '@/app/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as ImagePicker from 'expo-image-picker';

interface Pais {
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
    numeroPais: 0,
    documento: '',
  });

  const [paises, setPaises] = useState<Pais[]>([]);
  const [cargandoPaises, setCargandoPaises] = useState(true);
  const [documentFront, setDocumentFront] = useState<string | null>(null);
  const [documentBack, setDocumentBack] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaisModal, setShowPaisModal] = useState(false);

  useEffect(() => {
    apiGet('/paises')
      .then((resp) => {
        // El endpoint devuelve { status: 'success', data: [...] }
        const lista: Pais[] = resp?.data ?? resp ?? [];
        setPaises(lista);
      })
      .catch(() => setPaises([]))
      .finally(() => setCargandoPaises(false));
  }, []);

  const updateFormData = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleDocumentPick = async (side: 'front' | 'back') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (result && !result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      if (side === 'front') { setDocumentFront(uri); } else { setDocumentBack(uri); }
    }
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    try {
      const fd = new FormData();
      fd.append('firstName', formData.firstName);
      fd.append('lastName', formData.lastName);
      fd.append('email', formData.email);
      fd.append('address', formData.address);
      fd.append('numeroPais', String(formData.numeroPais));
      fd.append('documento', formData.documento);

      if (documentFront) {
        fd.append('fotoFrente', {
          uri: documentFront,
          name: 'frente.jpg',
          type: 'image/jpeg',
        } as any);
      }
      if (documentBack) {
        fd.append('fotoDorso', {
          uri: documentBack,
          name: 'dorso.jpg',
          type: 'image/jpeg',
        } as any);
      }

      await apiPostFormData('/autenticacion/registrar', fd);
      Alert.alert(
        'Solicitud enviada',
        'Tu solicitud de registro fue recibida. Vamos a verificar tus datos y, si todo es correcto, te enviaremos una contraseña temporal al email que ingresaste para que puedas activar tu cuenta.'
      );
      router.push('/(autenticacion)/iniciar-sesion');
    } catch (error: any) {
      Alert.alert('Error en el registro', error.message || 'Ocurrió un error al registrarse');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
              <Text className="text-sm font-medium text-slate-700 mb-2">DNI</Text>
              <View className="relative justify-center">
                <View className="absolute left-3 z-10"><FileText color="#A08C79" size={18} /></View>
                <Input
                  className="pl-9" containerClassName="mb-0"
                  value={formData.documento} onChangeText={(t) => updateFormData('documento', t.replace(/\D/g, '').slice(0, 8))}
                  placeholder="12345678" keyboardType="numeric" maxLength={8}
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
              <TouchableOpacity
                onPress={() => !cargandoPaises && setShowPaisModal(true)}
                className="border border-slate-200 rounded-lg bg-white h-12 flex-row items-center px-3"
              >
                <FileText color="#A08C79" size={18} />
                {cargandoPaises ? (
                  <ActivityIndicator size="small" color="#A08C79" style={{ marginLeft: 8, flex: 1 }} />
                ) : (
                  <>
                    <Text className="flex-1 ml-2" style={{ color: formData.numeroPais ? '#333F48' : '#9CA3AF' }}>
                      {formData.numeroPais ? paises.find(p => p.id === formData.numeroPais)?.name : 'Seleccioná un país'}
                    </Text>
                    <ChevronDown color="#A08C79" size={18} />
                  </>
                )}
              </TouchableOpacity>

              <Modal visible={showPaisModal} transparent animationType="slide">
                <TouchableOpacity
                  style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
                  activeOpacity={1}
                  onPress={() => setShowPaisModal(false)}
                />
                <View style={{ backgroundColor: 'white', maxHeight: 360, borderTopLeftRadius: 16, borderTopRightRadius: 16, position: 'absolute', bottom: 0, left: 0, right: 0 }}>
                  <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
                    <Text className="text-base font-semibold text-[#333F48]">Seleccioná un país</Text>
                    <TouchableOpacity onPress={() => setShowPaisModal(false)}>
                      <Text className="text-[#6A4F99] font-semibold">Listo</Text>
                    </TouchableOpacity>
                  </View>
                  <FlatList
                    data={paises}
                    keyExtractor={(p) => String(p.id)}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => { updateFormData('numeroPais', item.id); setShowPaisModal(false); }}
                        className="px-4 py-3 border-b border-gray-50 flex-row justify-between items-center"
                      >
                        <Text style={{ color: formData.numeroPais === item.id ? '#6A4F99' : '#333F48', fontWeight: formData.numeroPais === item.id ? '600' : '400' }}>
                          {item.name}
                        </Text>
                        {formData.numeroPais === item.id && <Text className="text-[#6A4F99]">✓</Text>}
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </Modal>
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
                    <Text className="text-xs text-green-600 font-medium">Frente cargado</Text>
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
                    <Text className="text-xs text-green-600 font-medium">Dorso cargado</Text>
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
              <Link href="/(autenticacion)/iniciar-sesion" asChild>
                <Text className="text-[#6A4F99] font-semibold">Inicia sesión aquí</Text>
              </Link>
            </View>
          </View>

          <Modal visible={showConfirmModal} transparent animationType="fade">
            <View className="flex-1 bg-black/50 justify-center px-4">
              <View className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm self-center">
                <Text className="text-xl font-bold text-[#333F48] mb-4">Confirmar Envío</Text>
                <Text className="text-sm text-[#A08C79] mb-6 leading-relaxed">
                  ¿Estás seguro de que deseas enviar estos datos? Una vez enviados, no podrás modificarlos hasta que un empleado revise tu solicitud.
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
                    onPress={handleConfirm}
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
    </KeyboardAvoidingView>
  );
}
