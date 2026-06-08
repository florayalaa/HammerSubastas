import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese todos los datos');
      return;
    }

    setLoading(true);

    try {
      // Ejecutamos el login del contexto
      const response = await login(email, password);

      // CASO A: El AuthContext detecta primer ingreso (mustChangePassword) y devuelve el flag
      if (response?.mustChangePassword) {
        setLoading(false);
        router.replace({
          pathname: '/(auth)/complete-registration',
          params: { 
            email: email, 
            code: password, //Viaja la contraseña provisoria automática como código de validación
            source: 'first_login'
          }
        });
        return;
      }

      // Si el login es común y ya tiene contraseña definitiva, va directo a la app
      router.replace('/(tabs)');
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.message || '';

      // CASO B: Por si tu AuthContext tira el error controlado en vez de retornar el objeto
      if (errorMessage.includes('Cambio de contraseña obligatorio') || errorMessage.includes('mustChangePassword')) {
        router.replace({
          pathname: '/(auth)/complete-registration',
          params: { 
            email: email, 
            code: password, // Mandamos la clave provisoria tipeada
            source: 'first_login'
          }
        });
      } 
      else if (errorMessage.includes('completar el registro') || errorMessage.includes('revisión')) {
        Alert.alert('Cuenta en revisión', 'Tu solicitud está siendo analizada por un administrador. Te avisaremos por correo.');
      } 
      else {
        Alert.alert('Error de autenticación', errorMessage || 'No se pudo iniciar sesión. Verifique sus datos.');
      }
    } finally {
      if (!email) setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerClassName="flex-grow justify-center px-4 py-12">
      <View className="w-full max-w-md self-center">
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-[#333F48] mb-2">Ingrese sus datos</Text>
          <Text className="text-sm text-[#A08C79]">Inicia sesión para operar en las subastas</Text>
        </View>

        <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Input Email */}
          <View className="mb-4">
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

          {/* Input Password */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-slate-700 mb-2">Contraseña</Text>
            <View className="relative justify-center">
              <View className="absolute left-3 z-10">
                <Lock color="#A08C79" size={20} />
              </View>
              <Input
                className="pl-10"
                containerClassName="mb-0"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                editable={!loading}
              />
            </View>
          </View>

          {/* Olvidé mi contraseña */}
          <View className="flex-row items-center justify-end mb-6 mt-2">
            <Link href="/(auth)/forgot-password" asChild>
              <Text className="text-sm text-[#6A4F99] font-medium">¿Olvidaste tu contraseña?</Text>
            </Link>
          </View>

          {/* Botón de Enviar */}
          <Button onPress={handleSubmit} disabled={loading} className="w-full bg-[#6A4F99] rounded-lg h-12">
            {loading ? <ActivityIndicator color="#fff" /> : "Iniciar Sesión"}
          </Button>

          {/* Links del pie */}
          <View className="mt-6 flex-row justify-center">
            <Text className="text-[#A08C79]">¿No tienes una cuenta? </Text>
            <Link href="/(auth)/register" asChild>
              <Text className="text-[#6A4F99] font-semibold">Regístrate aquí</Text>
            </Link>
          </View>
          
          <View className="mt-3 flex-row justify-center">
            <Text className="text-[#A08C79]">¿Ya te registraste? </Text>
            <Link href="/(auth)/complete-registration" asChild>
              <Text className="text-[#6A4F99] font-semibold">Verifica tu código</Text>
            </Link>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
