import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ contentStyle: { backgroundColor: '#6A4F99' } }}>
      <Stack.Screen name="iniciar-sesion" options={{ title: 'Iniciar Sesión', headerShown: false }} />
      <Stack.Screen name="registro" options={{ title: 'Registro', headerShown: false }} />
      <Stack.Screen name="completar-registro" options={{ title: 'Completar Registro', headerShown: false }} />
      <Stack.Screen name="olvide-contrasena" options={{ title: 'Olvidé mi Contraseña', headerShown: false }} />
    </Stack>
  );
}
