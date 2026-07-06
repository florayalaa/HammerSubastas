import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Modal, Alert, ActivityIndicator, Image, FlatList } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Upload, X, CheckCircle, Info, ChevronDown, ChevronUp, Camera, Images, Tag } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import * as ImagePicker from 'expo-image-picker';
import { apiPost, apiGet } from '@/app/lib/api';
import { useAuth } from '@/context/AuthContext';
import { EncabezadoTab } from '@/components/EncabezadoTab';

interface CategoriaArticulo {
  valor: string;
  ejemplos: string;
}

export default function SellItem() {
  const router = useRouter();
  const { token } = useAuth();
  const scrollRef = useRef<ScrollView>(null);
  useFocusEffect(useCallback(() => { scrollRef.current?.scrollTo({ y: 0, animated: false }); }, []));

  const [categoriasArticulo, setCategoriasArticulo] = useState<CategoriaArticulo[]>([]);

  useEffect(() => {
    apiGet('/categorias-articulo', token ?? undefined)
      .then((data) => { if (Array.isArray(data)) setCategoriasArticulo(data); })
      .catch(() => {});
  }, []);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoria: '',
    agreedToTerms: false,
    artistOrDesigner: '',
    date: '',
    history: '',
  });
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<{ uri: string; base64: string }[]>([]);
  const [showInfoBanner, setShowInfoBanner] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStep1Submit = () => {
    if (uploadedImages.length < 6) {
      Alert.alert('Atención', 'Debés subir al menos 6 imágenes del artículo.');
      return;
    }
    if (!formData.agreedToTerms) {
      Alert.alert('Atención', 'Debés aceptar los términos y condiciones.');
      return;
    }
    if (!formData.title || !formData.description) {
      Alert.alert('Atención', 'Por favor completá el título y la descripción.');
      return;
    }
    if (!formData.categoria) {
      Alert.alert('Atención', 'Por favor seleccioná una categoría.');
      return;
    }
    setStep(2);
  };

  const handleGallery = async () => {
    if (uploadedImages.length >= 10) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsMultipleSelection: true,
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const disponibles = 10 - uploadedImages.length;
      const nuevas = result.assets
        .slice(0, disponibles)
        .filter((a) => a.base64)
        .map((a) => ({ uri: a.uri, base64: a.base64! }));
      setUploadedImages([...uploadedImages, ...nuevas]);
    }
  };

  const handleCamera = async () => {
    if (uploadedImages.length >= 10) return;
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a la cámara para tomar fotos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0].base64) {
      setUploadedImages([...uploadedImages, { uri: result.assets[0].uri, base64: result.assets[0].base64 }]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
  };

  const handleConfirmar = async () => {
    setShowConfirmModal(false);
    setSubmitting(true);
    try {
      let descripcionCompleta = formData.description;
      const extras = [
        formData.artistOrDesigner && `Artista/Diseñador: ${formData.artistOrDesigner}`,
        formData.date && `Fecha/Época: ${formData.date}`,
        formData.history && `Historia: ${formData.history}`,
      ].filter(Boolean).join(' | ');
      if (extras) descripcionCompleta += `\n\n${extras}`;

      await apiPost('/articulos/enviar', {
        descripcionCatalogo: formData.title,
        descripcionCompleta,
        fotosBase64: uploadedImages.map((img) => img.base64),
        categoria: formData.categoria,
      }, token || '', 60000);

      // Reseteamos el formulario para que la próxima vez que se entre a "Vender" esté en blanco
      // (esta pantalla no se desmonta al cambiar de tab, así que el estado quedaría viejo si no).
      setStep(1);
      setFormData({
        title: '',
        description: '',
        categoria: '',
        agreedToTerms: false,
        artistOrDesigner: '',
        date: '',
        history: '',
      });
      setUploadedImages([]);

      router.replace('/perfil/mis-ventas');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo enviar el artículo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <View className="flex-1 bg-gray-50">
        <EncabezadoTab titulo="Vender" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6A4F99" />
          <Text className="text-[#A08C79] mt-4">Enviando solicitud...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
    <EncabezadoTab titulo="Vender" />
    <ScrollView ref={scrollRef} className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-4">
        <Text className="text-3xl font-bold text-[#333F48]">Vender un Artículo</Text>
        <Text className="text-[#A08C79] mt-1">Consigná tu pieza para subasta</Text>
      </View>

      <View className="py-2">
        {/* Progreso */}
        <View className="flex-row items-center justify-center mb-8">
          <View className="items-center flex-row">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${step >= 1 ? 'bg-[#6A4F99]' : 'bg-gray-300'}`}>
              <Text className="text-white font-bold">1</Text>
            </View>
            <Text className={`ml-2 text-sm font-medium ${step >= 1 ? 'text-[#333F48]' : 'text-gray-400'}`}>Información básica</Text>
          </View>
          <View className={`h-1 w-12 mx-2 ${step >= 2 ? 'bg-[#6A4F99]' : 'bg-gray-300'}`} />
          <View className="items-center flex-row">
            <View className={`w-8 h-8 rounded-full items-center justify-center ${step >= 2 ? 'bg-[#6A4F99]' : 'bg-gray-300'}`}>
              <Text className="text-white font-bold">2</Text>
            </View>
            <Text className={`ml-2 text-sm font-medium ${step >= 2 ? 'text-[#333F48]' : 'text-gray-400'}`}>Info adicional</Text>
          </View>
        </View>

        {/* Banner info */}
        <TouchableOpacity
          onPress={() => setShowInfoBanner(!showInfoBanner)}
          className={`flex-row items-center justify-between p-4 bg-[#C9A063]/10 border border-[#C9A063]/30 ${showInfoBanner ? 'rounded-t-lg border-b-0' : 'rounded-lg mb-4'}`}
        >
          <View className="flex-row items-center gap-2">
            <Info color="#C9A063" size={20} />
            <Text className="font-semibold text-[#C9A063]">Información Importante</Text>
          </View>
          {showInfoBanner ? <ChevronUp color="#C9A063" size={20} /> : <ChevronDown color="#C9A063" size={20} />}
        </TouchableOpacity>

        {showInfoBanner && (
          <View className="bg-[#C9A063]/5 border border-[#C9A063]/30 border-t-0 rounded-b-lg p-4 mb-4">
            <Text className="text-xs text-[#A08C79] mb-2">• Mínimo 6 imágenes de alta calidad.</Text>
            <Text className="text-xs text-[#A08C79] mb-2">• El artículo debe ser de tu propiedad.</Text>
            <Text className="text-xs text-[#A08C79] mb-2">• Los costos de envío corren por tu cuenta.</Text>
            <Text className="text-xs text-[#A08C79]">• Nuestros expertos determinan el valor base.</Text>
          </View>
        )}

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          {step === 1 ? (
            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-[#333F48] mb-2">Título del Artículo *</Text>
                <TextInput
                  value={formData.title}
                  onChangeText={(t) => updateFormData('title', t)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                  placeholder="Ej: Reloj Omega Vintage"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-[#333F48] mb-2 mt-4">Descripción Detallada *</Text>
                <TextInput
                  value={formData.description}
                  onChangeText={(t) => updateFormData('description', t)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                  placeholder="Describí el artículo, su estado, características..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View className="mt-4">
                <Text className="text-sm font-medium text-[#333F48] mb-2">Categoría *</Text>
                <TouchableOpacity
                  onPress={() => setShowCategoriaModal(true)}
                  style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb', borderWidth: 1, borderColor: formData.categoria ? '#6A4F99' : '#e5e7eb', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 12 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                    <Tag color={formData.categoria ? '#6A4F99' : '#A08C79'} size={16} />
                    {formData.categoria ? (
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#333F48', fontWeight: '600', fontSize: 14 }}>{formData.categoria}</Text>
                        <Text style={{ color: '#A08C79', fontSize: 12 }} numberOfLines={1}>
                          {categoriasArticulo.find(c => c.valor === formData.categoria)?.ejemplos}
                        </Text>
                      </View>
                    ) : (
                      <Text style={{ color: '#A08C79', fontSize: 14 }}>Seleccioná una categoría</Text>
                    )}
                  </View>
                  <ChevronDown color="#A08C79" size={18} />
                </TouchableOpacity>
              </View>

              <View className="mt-4">
                <Text className="text-sm font-medium text-[#333F48] mb-2">Imágenes ({uploadedImages.length}/10) *</Text>

                {uploadedImages.length > 0 && (
                  <View className="flex-row flex-wrap gap-2 mb-3">
                    {uploadedImages.map((img, i) => (
                      <View key={i} style={{ position: 'relative' }}>
                        <Image source={{ uri: img.uri }} style={{ width: 72, height: 72, borderRadius: 8 }} />
                        <TouchableOpacity
                          onPress={() => removeImage(i)}
                          style={{ position: 'absolute', top: -6, right: -6, backgroundColor: '#ef4444', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
                        >
                          <X color="white" size={12} />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                {uploadedImages.length < 10 && (
                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={handleGallery}
                      className="flex-1 border-2 border-dashed border-gray-300 rounded-lg p-5 items-center justify-center bg-gray-50"
                    >
                      <Images color="#A08C79" size={24} />
                      <Text className="text-xs text-[#A08C79] font-medium mt-2 text-center">Galería</Text>
                      <Text className="text-[10px] text-gray-400 mt-0.5 text-center">Selección múltiple</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleCamera}
                      className="flex-1 border-2 border-dashed border-[#6A4F99]/40 rounded-lg p-5 items-center justify-center bg-[#6A4F99]/5"
                    >
                      <Camera color="#6A4F99" size={24} />
                      <Text className="text-xs text-[#6A4F99] font-medium mt-2 text-center">Cámara</Text>
                      <Text className="text-[10px] text-gray-400 mt-0.5 text-center">Sacar foto ahora</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View className="flex-row items-center mt-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <TouchableOpacity
                  onPress={() => updateFormData('agreedToTerms', !formData.agreedToTerms)}
                  className={`w-6 h-6 rounded border items-center justify-center mr-3 ${formData.agreedToTerms ? 'bg-[#6A4F99] border-[#6A4F99]' : 'border-gray-300 bg-white'}`}
                >
                  {formData.agreedToTerms && <CheckCircle color="white" size={16} />}
                </TouchableOpacity>
                <Text className="text-sm text-[#333F48] flex-1">
                  Acepto los{' '}
                  <Text onPress={() => setShowTermsModal(true)} className="text-[#6A4F99] font-bold">
                    términos y condiciones
                  </Text>
                </Text>
              </View>

              <Button
                onPress={handleStep1Submit}
                className={`w-full mt-6 h-12 rounded-xl ${(!formData.title || !formData.description || !formData.categoria || !formData.agreedToTerms || uploadedImages.length < 6) ? 'bg-gray-400' : 'bg-[#6A4F99]'}`}
                disabled={!formData.title || !formData.description || !formData.categoria || !formData.agreedToTerms || uploadedImages.length < 6}
              >
                Continuar
              </Button>
            </View>
          ) : (
            <View className="space-y-4">
              <View className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <Text className="text-xs text-blue-800">
                  <Text className="font-bold">Opcional:</Text> Esta información ayuda a nuestros expertos a valorar mejor tu pieza.
                </Text>
              </View>

              {formData.categoria === 'Arte' && (
                <View>
                  <Text className="text-sm font-medium text-[#333F48] mb-2">Artista o Diseñador</Text>
                  <TextInput
                    value={formData.artistOrDesigner}
                    onChangeText={(t) => updateFormData('artistOrDesigner', t)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                    placeholder="Ej: Pablo Picasso"
                  />
                </View>
              )}

              <View>
                <Text className="text-sm font-medium text-[#333F48] mb-2 mt-4">Fecha o Época</Text>
                <TextInput
                  value={formData.date}
                  onChangeText={(t) => updateFormData('date', t)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                  placeholder="Ej: Siglo XVIII"
                />
              </View>

              <View>
                <Text className="text-sm font-medium text-[#333F48] mb-2 mt-4">Historia del Objeto</Text>
                <TextInput
                  value={formData.history}
                  onChangeText={(t) => updateFormData('history', t)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]"
                  placeholder="Contexto, dueños anteriores..."
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>

              <View className="mt-4">
                <Text className="text-sm font-medium text-[#333F48] mb-2">Comprobante de Origen Lícito (Opcional)</Text>
                <Text className="text-xs text-[#A08C79] mb-3">Requerido para sumas altas.</Text>
                <TouchableOpacity
                  onPress={() => Alert.alert('Adjuntar', 'Funcionalidad de adjunto próximamente.')}
                  className="border-2 border-dashed border-[#6A4F99]/50 rounded-lg p-4 items-center justify-center bg-[#6A4F99]/5 flex-row"
                >
                  <Upload color="#6A4F99" size={20} />
                  <Text className="text-sm text-[#6A4F99] font-medium ml-2">Adjuntar Archivo o Foto</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row gap-3 mt-6">
                <Button variant="secondary" onPress={() => setStep(1)} className="flex-1 h-12 rounded-xl">
                  Volver
                </Button>
                <Button onPress={() => setShowConfirmModal(true)} className="flex-1 bg-[#6A4F99] h-12 rounded-xl">
                  Enviar
                </Button>
              </View>
            </View>
          )}
        </View>
        <View className="h-10" />
      </View>

      {/* Modal Categoría */}
      <Modal visible={showCategoriaModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: 'white', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 20, paddingBottom: 40, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333F48' }}>Seleccioná una categoría</Text>
              <TouchableOpacity onPress={() => setShowCategoriaModal(false)}>
                <X color="#333F48" size={22} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={categoriasArticulo}
              keyExtractor={(item) => item.valor}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => { updateFormData('categoria', item.valor); setShowCategoriaModal(false); }}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f3f4f6', backgroundColor: formData.categoria === item.valor ? '#f5f3ff' : 'white' }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: formData.categoria === item.valor ? '#6A4F99' : '#333F48' }}>
                      {item.valor}
                    </Text>
                    <Text style={{ fontSize: 12, color: '#A08C79', marginTop: 2 }}>{item.ejemplos}</Text>
                  </View>
                  {formData.categoria === item.valor && (
                    <CheckCircle color="#6A4F99" size={20} />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Confirmación */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6 shadow-xl">
            <Text className="text-xl font-bold text-[#333F48] mb-3">Confirmar Envío</Text>
            <Text className="text-sm text-[#A08C79] mb-4">
              Una vez enviada, la solicitud será revisada por nuestros expertos. Te contactaremos en 24-48 horas.
            </Text>
            <View className="flex-row gap-3">
              <Button variant="secondary" onPress={() => setShowConfirmModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onPress={handleConfirmar} className="flex-1 bg-[#6A4F99]">
                Confirmar
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Términos */}
      <Modal visible={showTermsModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-[70%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-[#333F48]">Términos y Condiciones</Text>
              <TouchableOpacity onPress={() => setShowTermsModal(false)}>
                <X color="#333F48" size={24} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="font-bold text-[#333F48] mb-1">1. Propiedad del Artículo</Text>
              <Text className="text-sm text-[#A08C79] mb-4">Declaro que el artículo es de mi propiedad y tengo derecho a venderlo.</Text>
              <Text className="font-bold text-[#333F48] mb-1">2. Costos de Envío</Text>
              <Text className="text-sm text-[#A08C79] mb-4">Los costos de envío para inspección corren por mi cuenta.</Text>
              <Text className="font-bold text-[#333F48] mb-1">3. Valoración</Text>
              <Text className="text-sm text-[#A08C79] mb-4">El valor será determinado exclusivamente por los expertos de HAMMER.</Text>
              <View className="h-10" />
            </ScrollView>
            <Button onPress={() => setShowTermsModal(false)} className="w-full bg-[#6A4F99] h-12 rounded-xl mt-4">
              Cerrar
            </Button>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </View>
  );
}
