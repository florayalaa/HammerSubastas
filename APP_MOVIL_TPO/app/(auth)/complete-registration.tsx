import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Lock, ChevronLeft, Key, Mail, Hash } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiPost } from '@/app/lib/api';

export default function CompleteRegistration() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleComplete = async () => {
    if (!email || !code || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    
    try {
      const response = await apiPost('/auth/complete-registration', { email, code, newPassword: password });
      if (typeof window !== 'undefined') {
        window.alert("¡Registro Completado! Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar sesión.");
      } else {
        Alert.alert("¡Registro Completado!", "Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar sesión.");
      }
      router.push('/(auth)/login');
    } catch (error: any) {
      const errorMsg = error.message || "Código inválido o error al completar el registro";
      console.error("Error backend:", errorMsg);
      if (typeof window !== 'undefined') {
        window.alert("Error: " + errorMsg);
      } else {
        Alert.alert("Error", errorMsg);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-6 py-12">
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
          <Text className="text-sm font-medium text-slate-700 mb-2">Correo Electrónico</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Mail color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={email} onChangeText={setEmail}
              placeholder="tu@email.com" keyboardType="email-address" autoCapitalize="none"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Código Temporal</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Hash color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={code} onChangeText={setCode}
              placeholder="Ej: A1B2C3" autoCapitalize="characters"
            />
          </View>
        </View>

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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
