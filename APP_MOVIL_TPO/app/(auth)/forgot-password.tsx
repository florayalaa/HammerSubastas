import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiPost } from '@/app/lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRecover = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor, ingrese su correo electrónico.');
      return;
    }

    setLoading(true);

    try {
      // Llamamos al endpoint del backend que genera el PIN en recoveryCache
      await apiPost('/auth/forgot-password', { email: email.trim().toLowerCase() });

      Alert.alert(
        'Código Enviado',
        'Si el correo es válido, recibirás un PIN de seguridad en los próximos minutos.',
        [
          {
            text: 'Ingresar Código',
            onPress: () => router.push({
              pathname: '/(auth)/verify-code',
              params: { email: email.trim().toLowerCase() }
            } as any)
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo procesar la solicitud de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-12">
      <View className="w-full max-w-md self-center">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">Recuperar Clave</Text>
          <Text className="text-sm text-[#A08C79] text-center px-6">
            Introduce tu correo electrónico registrado y te enviaremos un código para restablecer tu contraseña.
          </Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Input Email */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">Correo Electrónico</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10">
                <Mail color="#A08C79" size={20} />
              </View>
              <Input
                className="pl-10"
                containerClassName="mb-0"
                value={email}
                onChangeText={setEmail}
                placeholder="tu@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
            </View>
          </View>

          {/* Botón de Enviar */}
          <Button 
            onPress={handleRecover} 
            disabled={loading}
            className="w-full bg-[#6A4F99] rounded-lg h-12"
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Enviar Código"}
          </Button>

          {/* Volver al Login */}
          <View className="mt-6 flex-row justify-center">
            <Text 
              className="text-[#6A4F99] font-semibold text-sm" 
              onPress={() => router.replace('/(auth)/login')}
            >
              Volver al Inicio de Sesión
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}