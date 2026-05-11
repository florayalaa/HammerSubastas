import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Package } from 'lucide-react-native';

export default function MySales() {
  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="bg-white pt-14 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver al Perfil</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Mis Ventas</Text>
        <Text className="text-[#A08C79]">Seguimiento de artículos publicados</Text>
      </View>

      <View className="px-4 py-12 items-center justify-center">
        <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
          <Package color="#A08C79" size={32} />
        </View>
        <Text className="text-[#333F48] font-bold text-lg mb-2">Aún no tienes ventas</Text>
        <Text className="text-[#A08C79] text-center">Tus artículos en revisión y publicados aparecerán aquí.</Text>
      </View>
    </ScrollView>
  );
}
