import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function VerifyCode() {
  const router = useRouter();
  // Capturamos el email para saber a quién le pertenece el código
  const { email } = useLocalSearchParams<{ email: string }>();
  
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!code || code.length < 6) {
      Alert.alert('Código incompleto', 'Por favor, ingrese el código de 6 dígitos.');
      return;
    }

    setLoading(true);

    // Flujo rápido de UI: pasamos el email y el código validado a la pantalla de cambio definitivo
    setTimeout(() => {
      setLoading(false);
      router.push({
        pathname: '/(auth)/complete-registration',
        params: { 
          email: email, 
          code: code,
          source: 'recovery' // Le avisamos que viene desde recuperación por email
        }
      });
    }, 500);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-12">
      <View className="w-full max-w-md self-center">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">Verificar Código</Text>
          <Text className="text-sm text-[#A08C79] text-center px-4">
            Ingresa el código de seguridad de 6 dígitos que enviamos a:{"\n"}
            <Text className="font-semibold text-slate-700">{email || 'tu correo electrónico'}</Text>
          </Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <View className="mb-6">
            <Text className="text-sm font-medium text-slate-700 mb-2">Código de Seguridad</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10">
                <KeyRound color="#A08C79" size={20} />
              </View>
              <Input
                className="pl-10 text-center font-bold text-lg tracking-[6px]"
                containerClassName="mb-0"
                value={code}
                onChangeText={(text) => setCode(text.replace(/[^0-9]/g, '').slice(0, 6))}
                placeholder="000000"
                keyboardType="number-pad"
                editable={!loading}
              />
            </View>
          </View>

          <Button 
            onPress={handleVerify} 
            disabled={loading}
            className="w-full bg-[#6A4F99] rounded-lg h-12"
          >
            {loading ? <ActivityIndicator color="#fff" /> : "Continuar"}
          </Button>

          <View className="mt-6 flex-row justify-center">
            <Text className="text-[#A08C79]">¿No te llegó? </Text>
            <Text className="text-[#6A4F99] font-semibold" onPress={() => router.back()}>
              Reenviar código
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}