import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send, Users, HandCoins } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/Button';

export default function LiveAuction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [bidAmount, setBidAmount] = useState('');

  const currentItem = {
    title: "Anillo de Diamantes Art Déco",
    currentBid: 45000,
    highestBidder: "User***89",
    image: "https://images.unsplash.com/photo-1742240439165-60790db1ee93?auto=format&fit=crop&w=800&q=80",
    timeRemaining: "00:02:45"
  };

  return (
    <View className="flex-1 bg-gray-900">
      {/* Header */}
      <View className="pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-800 bg-gray-900 z-10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-gray-800 rounded-full">
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <View className="items-center">
          <View className="flex-row items-center gap-2 mb-1">
            <View className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <Text className="text-white font-bold tracking-widest">EN VIVO</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Users color="#9CA3AF" size={14} />
            <Text className="text-gray-400 text-xs">1,240 espectadores</Text>
          </View>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="pb-32">
        <Image source={{ uri: currentItem.image }} className="w-full h-72" contentFit="cover" />
        
        <View className="p-6 -mt-6 bg-gray-900 rounded-t-3xl">
          <Text className="text-2xl font-bold text-white mb-4">{currentItem.title}</Text>
          
          <View className="bg-gray-800 rounded-2xl p-6 mb-6 items-center">
            <Text className="text-gray-400 mb-2">Puja Actual</Text>
            <Text className="text-5xl font-bold text-green-400 mb-2">${currentItem.currentBid}</Text>
            <Text className="text-gray-400">Por: <Text className="font-bold text-white">{currentItem.highestBidder}</Text></Text>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-6">
            <Text className="text-red-400 font-bold text-xl">{currentItem.timeRemaining}</Text>
            <Text className="text-gray-400">restantes</Text>
          </View>

          <Text className="text-white font-bold mb-4">Actividad Reciente</Text>
          <View className="space-y-3 mb-8">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-300">User***89</Text>
              <Text className="text-green-400 font-bold">$45,000</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400">User***21</Text>
              <Text className="text-gray-400">$44,500</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-400">User***55</Text>
              <Text className="text-gray-400">$43,000</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bid Actions */}
      <View className="absolute bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4 pb-8">
        <View className="flex-row gap-3 mb-4">
          <Button variant="secondary" className="flex-1 bg-gray-800 border-gray-700 h-12">
            <Text className="text-white font-bold">+ $500</Text>
          </Button>
          <Button variant="secondary" className="flex-1 bg-gray-800 border-gray-700 h-12">
            <Text className="text-white font-bold">+ $1000</Text>
          </Button>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-800 rounded-xl px-4 h-14 border border-gray-700">
            <Text className="text-gray-400 text-lg mr-2">$</Text>
            <TextInput
              value={bidAmount}
              onChangeText={setBidAmount}
              placeholder="Monto a pujar"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="flex-1 text-white text-lg h-full"
            />
          </View>
          <TouchableOpacity className="w-14 h-14 bg-[#6A4F99] rounded-xl items-center justify-center">
            <HandCoins color="white" size={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
