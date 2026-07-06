import { Stack } from 'expo-router';

export default function SubastasStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#6A4F99' } }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" />
      <Stack.Screen name="articulo/[id]" />
    </Stack>
  );
}
