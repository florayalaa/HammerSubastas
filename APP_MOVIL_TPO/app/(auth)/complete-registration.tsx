import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Lock, ChevronLeft, Key, Mail, Hash } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { apiPost } from '@/app/lib/api';

export default function CompleteRegistration() {
  const router = useRouter();
  
  // 1. Capturamos los parámetros dinámicos que viajan por la URL
  const { email: paramEmail, code: paramCode, source } = useLocalSearchParams<{ email?: string; code?: string; source?: string }>();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Determinar si es flujo de recuperación u homologación inicial
  const isRecovery = source === 'recovery' || !source && !paramCode;

  // 2. Auto-completar campos si vienen desde la pantalla anterior (UX limpia)
  useEffect(() => {
    if (paramEmail) setEmail(paramEmail.trim().toLowerCase());
    if (paramCode) setCode(paramCode);
  }, [paramEmail, paramCode]);

  const handleComplete = async () => {
    if (!email || !code || !password || !confirmPassword) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }
    
    setLoading(true);

    try {
      const payload = { 
        email: email.trim().toLowerCase(), 
        code: code.trim(), 
        newPassword: password 
      };

      // 3. Bifurcación inteligente del Endpoint según procedencia
      if (isRecovery) {
        // Flujo: Olvidó su clave (Valida en RAM cache)
        await apiPost('/auth/reset-password', payload);
        Alert.alert("¡Contraseña Cambiada!", "Tu clave ha sido restablecida con éxito. Ya puedes iniciar sesión.");
      } else {
        // Flujo: Primer login obligatorio (Valida contra DB)
        await apiPost('/auth/complete-registration', payload);
        Alert.alert("¡Registro Completado!", "Tu cuenta ha sido activada exitosamente. Ahora puedes iniciar sesión.");
      }
      
      router.push('/(auth)/login');
    } catch (error: any) {
      const errorMsg = error.message || "Código inválido o error al procesar la solicitud.";
      console.error("Error backend:", errorMsg);
      Alert.alert("Error", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 px-6 justify-center">
      <TouchableOpacity 
        onPress={() => router.push('/(auth)/login')}
        className="absolute top-14 left-6 flex-row items-center"
        disabled={loading}
      >
        <ChevronLeft color="#A08C79" size={24} />
        <Text className="text-[#A08C79] font-medium ml-1">Volver al Login</Text>
      </TouchableOpacity>

      <View className="items-center mb-8 mt-10">
        <View className="w-16 h-16 bg-[#6A4F99]/10 rounded-full items-center justify-center mb-4">
          <Key color="#6A4F99" size={32} />
        </View>
        {/*4. Textos dinámicos adaptados al contexto */}
        <Text className="text-3xl font-bold text-[#333F48] mb-2 text-center">
          {isRecovery ? "Restablecer Clave" : "Completa tu Registro"}
        </Text>
        <Text className="text-sm text-[#A08C79] text-center px-4">
          {isRecovery 
            ? "Ingresa el PIN de 6 dígitos que enviamos a tu correo y tu nueva contraseña."
            : "Tu cuenta ha sido aprobada. Genera tu clave personal para acceder a la aplicación."}
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
              editable={!loading && !paramEmail} // Bloqueado si ya se conoce el email
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">
            {isRecovery ? "Código PIN (6 dígitos)" : "Contraseña Temporal"}
          </Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Hash color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={code} onChangeText={setCode}
              placeholder={isRecovery ? "Ej: 123456" : "Ej: A1B2C3"} 
              autoCapitalize="characters"
              keyboardType={isRecovery ? "number-pad" : "default"}
              editable={!loading}
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-medium text-slate-700 mb-2">Nueva Contraseña</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Lock color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={password} onChangeText={setPassword}
              placeholder="••••••••" secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-slate-700 mb-2">Confirmar Nueva Contraseña</Text>
          <View className="relative justify-center">
            <View className="absolute left-3 z-10"><Lock color="#A08C79" size={18} /></View>
            <Input
              className="pl-9" containerClassName="mb-0"
              value={confirmPassword} onChangeText={setConfirmPassword}
              placeholder="••••••••" secureTextEntry
              editable={!loading}
            />
          </View>
        </View>

        <Button 
          onPress={handleComplete} 
          className="w-full bg-[#6A4F99] h-12 rounded-xl"
          disabled={loading}
        >
          {loading ? <ActivityIndicator color="#fff" /> : (isRecovery ? "Actualizar Contraseña" : "Guardar y Finalizar")}
        </Button>
      </View>
    </View>
  );
}