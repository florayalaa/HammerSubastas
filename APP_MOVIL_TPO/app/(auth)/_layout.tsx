import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      {/* Pantalla principal de Login */}
      <Stack.Screen name="login" options={{ title: 'Iniciar Sesión', headerShown: false }} />
      
      {/* Flujo de Registro Inicial */}
      <Stack.Screen name="register" options={{ title: 'Registro', headerShown: false }} />
      
      {/* Formulario unificado de cambio de contraseña */}
      <Stack.Screen name="complete-registration" options={{ title: 'Completar Registro', headerShown: false }} />
      <Stack.Screen name="forgot-password" options={{ title: 'Recuperar Contraseña', headerShown: false }} />
      <Stack.Screen name="verify-code" options={{ title: 'Verificar Código', headerShown: false }} />
    </Stack>
  );
}
