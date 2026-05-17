import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, ChevronLeft, Key } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function CompleteRegistration() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleComplete = () => {
    if (!password || !confirmPassword) {
      Alert.alert("Error", "Por favor ingresa tu contraseña");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    
    Alert.alert(
      "¡Registro Completado!",
      "Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar sesión.",
      [
        { text: "Ir al Login", onPress: () => router.push('/(auth)/login') }
      ]
    );
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 justify-center">
      <TouchableOpacity 
        onPress={() => router.push('/(auth)/login')}
        className="absolute top-14 left-6 flex-row items-center"
      >
        <ChevronLeft color="#A08C79" size={24} />
        <Text className="text-[#A08C79] font-medium ml-1">Volver al Login</Text>
      </TouchableOpacity>

      <View className="items-center mb-8 mt-10">
        <View className="w-16 h-16 bg-[#6A4F99]/10 rounded-full items-center justify-center mb-4">
          <Key color="#6A4F99" size={32} />
        </View>
        <Text className="text-3xl font-bold text-[#333F48] mb-2 text-center">Completa tu Registro</Text>
        <Text className="text-sm text-[#A08C79] text-center px-4">
          Tu cuenta ha sido aprobada. Genera tu clave personal para acceder a la aplicación.
        </Text>
      </View>

      <View className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Crear Contraseña</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Lock color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={password} onChangeText={setPassword}
              placeholder="••••••••" secureTextEntry
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-slate-700 mb-2">Confirmar Contraseña</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Lock color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={confirmPassword} onChangeText={setConfirmPassword}
              placeholder="••••••••" secureTextEntry
            />
          </View>
        </View>

        <Button 
          onPress={handleComplete} 
          className="w-full bg-[#6A4F99] h-12 rounded-xl"
        >
          Guardar y Finalizar
        </Button>
      </View>
    </View>
  );
}
