import { Stack } from 'expo-router';

export default function PerfilStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#6A4F99' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="editar" />
      <Stack.Screen name="medios-de-pago/index" />
      <Stack.Screen name="medios-de-pago/[id]" />
      <Stack.Screen name="metricas" />
      <Stack.Screen name="mis-compras" />
      <Stack.Screen name="mis-documentos" />
      <Stack.Screen name="mis-ventas" />
      <Stack.Screen name="subir-articulo" />
    </Stack>
  );
}
