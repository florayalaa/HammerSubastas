import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Clock } from 'lucide-react-native';

const myBids = [
  {
    id: '1',
    title: 'iPhone 13 Pro Max',
    currentBid: 850,
    myBid: 850,
    status: 'winning',
    timeLeft: '2h 15m',
    image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=500&q=60',
  },
  {
    id: '2',
    title: 'MacBook Pro M1',
    currentBid: 1200,
    myBid: 1100,
    status: 'outbid',
    timeLeft: '5h 30m',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=500&q=60',
  }
];

export default function Bids() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="mb-6">
        <Text className="text-2xl font-bold text-[#333F48]">Mis Pujas Activas</Text>
        <Text className="text-sm text-[#A08C79] mt-1">Seguimiento de las subastas en las que participás</Text>
      </View>

      <View className="gap-4 mb-8">
        {myBids.map((bid) => (
          <Link key={bid.id} href={`/auctions/${bid.id}`} asChild>
            <TouchableOpacity className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-row h-32">
              <Image source={{ uri: bid.image }} className="w-1/3 h-full" resizeMode="cover" />
              <View className="p-3 flex-1 justify-between">
                <View>
                  <Text className="font-semibold text-base text-[#333F48] mb-1" numberOfLines={1}>
                    {bid.title}
                  </Text>
                  <View className="flex-row items-center">
                    <Clock size={12} color="#A08C79" />
                    <Text className="text-xs text-[#A08C79] ml-1">Faltan {bid.timeLeft}</Text>
                  </View>
                </View>
                <View>
                  <View className="flex-row justify-between items-end mb-1">
                    <Text className="text-xs text-slate-500">Puja actual:</Text>
                    <Text className="text-sm font-bold text-[#333F48]">${bid.currentBid}</Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-xs text-slate-500">Mi puja:</Text>
                    <View className={`px-2 py-1 rounded-full ${bid.status === 'winning' ? 'bg-green-100' : 'bg-red-100'}`}>
                      <Text className={`text-xs font-medium ${bid.status === 'winning' ? 'text-green-700' : 'text-red-700'}`}>
                        ${bid.myBid} {bid.status === 'winning' ? '(Ganando)' : '(Superada)'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
        {myBids.length === 0 && (
          <View className="items-center justify-center py-12">
            <Text className="text-gray-500">No tienes pujas activas.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}
