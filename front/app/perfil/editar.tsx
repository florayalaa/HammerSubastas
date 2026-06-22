import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, MapPin, Save, Camera, ChevronDown } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { apiGet, apiPut } from '@/app/lib/api';
import { CountryPickerModal } from '@/components/authComponents';
import * as ImagePicker from 'expo-image-picker';

interface Pais { id: number; name: string; }

export default function EditProfile() {
  const router = useRouter();
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPaisModal, setShowPaisModal] = useState(false);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [numeroPais, setNumeroPais] = useState(0);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    try {
      const [perfilRes, paisesRes] = await Promise.all([
        apiGet('/usuarios/yo', token!),
        apiGet('/paises'),
      ]);
      const user = perfilRes?.user;
      if (user) {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setAddress(user.address || '');
        setNumeroPais(user.numeroPais ?? 0);
        if (user.foto) setFotoUri(`data:image/jpeg;base64,${user.foto}`);
      }
      setPaises(paisesRes?.data ?? paisesRes ?? []);
    } catch {
      Alert.alert('Error', 'No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { cargarDatos(); }, [cargarDatos]);

  const elegirFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: 'images',
      allowsEditing: true, // Permite recortar la foto
      aspect: [1, 1],      // Fuerza a que sea un cuadrado perfecto
      quality: 0.3,        // Calidad 0.4 (pesará menos que 0.7)
      base64: true,
     });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
      setFotoBase64(result.assets[0].base64 ?? null);
    }
  };

  const sacarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ 
      mediaTypes: 'images',
      allowsEditing: true, // Permite recortar la foto
      aspect: [1, 1],      // Fuerza a que sea un cuadrado perfecto
      quality: 0.3,        // Calidad 0.4 (pesará menos que 0.7)
      base64: true,
    });
    if (!result.canceled && result.assets[0]) {
      setFotoUri(result.assets[0].uri);
      setFotoBase64(result.assets[0].base64 ?? null);
    }
  };

  const handleFoto = () => {
    Alert.alert('Foto de perfil', '¿Cómo querés cargar la foto?', [
      { text: 'Cámara', onPress: sacarFoto },
      { text: 'Galería', onPress: elegirFoto },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const handleSubmit = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Nombre y apellido son obligatorios.');
      return;
    }
    setSubmitting(true);
    try {
      const body: any = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        address: address.trim(),
      };
      if (numeroPais) body.numeroPais = numeroPais;
      if (fotoBase64) body.foto = fotoBase64;

      await apiPut('/usuarios/yo', body, token!);
      Alert.alert('Éxito', 'Perfil actualizado', [{ text: 'OK', onPress: () => router.back() }]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo actualizar el perfil');
    } finally {
      setSubmitting(false);
    }
  };

  const paisSeleccionado = paises.find(p => p.id === numeroPais);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="bg-white pt-14 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver al Perfil</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Editar Perfil</Text>
        <Text className="text-[#A08C79]">Actualizá tu información personal</Text>
      </View>

      <View className="px-4 py-6">
        {/* Foto de perfil */}
        <View className="items-center mb-6">
          <TouchableOpacity onPress={handleFoto} className="relative">
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} className="w-24 h-24 rounded-full" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-[#6A4F99]/10 items-center justify-center">
                <User color="#6A4F99" size={40} />
              </View>
            )}
            <View className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#6A4F99] items-center justify-center border-2 border-white">
              <Camera color="white" size={14} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleFoto} className="mt-2">
            <Text className="text-sm text-[#6A4F99] font-medium">Cambiar foto</Text>
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          {/* Información Personal */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2 mb-4">
              <User color="#6A4F99" size={20} />
              <Text className="text-lg font-bold text-[#333F48]">Información Personal</Text>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#333F48] mb-2">Nombre</Text>
              <TextInput
                value={firstName}
                onChangeText={setFirstName}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                placeholderTextColor="#C4B5A5"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-[#333F48] mb-2">Apellido</Text>
              <TextInput
                value={lastName}
                onChangeText={setLastName}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                placeholderTextColor="#C4B5A5"
              />
            </View>
          </View>

          {/* Ubicación */}
          <View>
            <View className="flex-row items-center gap-2 mb-4">
              <MapPin color="#6A4F99" size={20} />
              <Text className="text-lg font-bold text-[#333F48]">Ubicación</Text>
            </View>
            <View className="mb-4">
              <Text className="text-sm font-medium text-[#333F48] mb-2">País</Text>
              <TouchableOpacity
                onPress={() => setShowPaisModal(true)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 flex-row items-center justify-between"
              >
                <Text style={{ color: paisSeleccionado ? '#333F48' : '#9CA3AF' }}>
                  {paisSeleccionado ? paisSeleccionado.name : 'Seleccioná un país'}
                </Text>
                <ChevronDown color="#A08C79" size={18} />
              </TouchableOpacity>
            </View>
            <View>
              <Text className="text-sm font-medium text-[#333F48] mb-2">Dirección</Text>
              <TextInput
                value={address}
                onChangeText={setAddress}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                placeholder="Ej: Av. Corrientes 1234, CABA"
                placeholderTextColor="#C4B5A5"
              />
            </View>
          </View>
        </View>

        <View className="flex-col gap-3">
          <TouchableOpacity onPress={handleSubmit} disabled={submitting} className="w-full bg-[#6A4F99] h-12 rounded-xl flex-row items-center justify-center">
            <Save color="white" size={20} />
            <Text className="text-white font-bold text-base text-center ml-2">{submitting ? 'Guardando...' : 'Guardar Cambios'}</Text>
          </TouchableOpacity>
          <Button variant="secondary" onPress={() => router.back()} className="w-full h-12 rounded-xl">
            Cancelar
          </Button>
        </View>
        <View className="h-10" />
      </View>

      <CountryPickerModal
        visible={showPaisModal}
        onClose={() => setShowPaisModal(false)}
        paises={paises}
        selectedId={numeroPais}
        onSelect={(id) => { setNumeroPais(id); setShowPaisModal(false); }}
      />
    </ScrollView>
  );
}
