import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/authComponents';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico');
      return;
    }
    Alert.alert(
      'Correo Enviado',
      'Si el correo electrónico existe en nuestra base de datos, recibirás un enlace para restablecer tu contraseña.',
      [{ text: 'OK', onPress: () => router.replace('/(autenticacion)/iniciar-sesion') }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-12">
        <View className="w-full max-w-md self-center">
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-[#333F48] mb-2">Recuperar Contraseña</Text>
            <Text className="text-sm text-[#A08C79] text-center px-4">
              Ingresá tu correo electrónico y te enviaremos las instrucciones para restablecer tu contraseña.
            </Text>
          </View>

          <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <FormField 
              label="Correo Electrónico" 
              icon={<Mail color="#A08C79" size={18} />} 
              value={email} 
              onChangeText={setEmail} 
              placeholder="tu@email.com" 
              keyboardType="email-address" 
            />

            <Button onPress={handleSubmit} className="w-full bg-[#6A4F99] rounded-lg h-12 mb-4">
              Enviar Instrucciones
            </Button>

            <View className="flex-row justify-center">
              <Text className="text-[#A08C79]">¿Recordaste tu contraseña? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text className="text-[#6A4F99] font-semibold">Volver al login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}