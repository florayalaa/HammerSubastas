import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { TrendingUp, Gavel, DollarSign, Clock, ChevronRight } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Card, CardContent } from '@/components/ui/Card';

export default function Dashboard() {
  const stats = [
    { label: "Subastas Activas", value: "12", color: "bg-[#6A4F99]" },
    { label: "Participaciones", value: "45", color: "bg-[#C9A063]" },
    { label: "Total Gastado", value: "$125,400", color: "bg-[#A08C79]" },
  ];

  const activeAuctions = [
    {
      id: 1,
      title: "Subasta de Arte Contemporáneo",
      date: "18 de Marzo, 2026 - 18:00",
      category: "Oro",
      items: 24,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Colección de Relojes de Lujo",
      date: "19 de Marzo, 2026 - 20:00",
      category: "Platino",
      items: 18,
      status: "live",
      image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const recentBids = [
    { item: "Reloj Patek Philippe 1942", bid: "$45,000", status: "leading", time: "Hace 15 min" },
    { item: "Collar de Esmeraldas", bid: "$28,500", status: "outbid", time: "Hace 1 hora" },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      
      {/* Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-[#333F48]">Dashboard</Text>
        </View>
        <View className="px-3 py-1 bg-[#C9A063] rounded-full">
          <Text className="text-white text-xs font-semibold">Categoría: Oro</Text>
        </View>
      </View>

      {/* Stats Grid */}
      <View className="flex-row gap-3 mb-6">
        {stats.slice(0, 2).map((stat, idx) => (
          <Card key={idx} className="flex-1 border-gray-200">
            <CardContent className="p-4 pt-4">
              <View className={`${stat.color} w-10 h-10 rounded-lg items-center justify-center mb-3`}>
                <Gavel color="white" size={20} />
              </View>
              <Text className="text-2xl font-bold text-[#333F48] mb-1">{stat.value}</Text>
              <Text className="text-xs text-[#A08C79]">{stat.label}</Text>
            </CardContent>
          </Card>
        ))}
      </View>

      {/* Total Gastado */}
      <Card className="mb-8 border-gray-200">
        <CardContent className="p-4 pt-4 flex-row items-center">
          <View className={`${stats[2].color} w-12 h-12 rounded-lg items-center justify-center mr-4`}>
            <DollarSign color="white" size={24} />
          </View>
          <View>
            <Text className="text-2xl font-bold text-[#333F48]">{stats[2].value}</Text>
            <Text className="text-sm text-[#A08C79]">{stats[2].label}</Text>
          </View>
        </CardContent>
      </Card>

      {/* Active Auctions */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-[#333F48]">Subastas Activas</Text>
          <Link href="/(tabs)/auctions" asChild>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#6A4F99] mr-1 font-medium">Ver todas</Text>
              <ChevronRight color="#6A4F99" size={16} />
            </TouchableOpacity>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
          {activeAuctions.map((auction) => (
            <Link key={auction.id} href={`/(tabs)/auctions`} asChild>
              <TouchableOpacity className="bg-white rounded-xl shadow-sm border border-gray-200 w-72 mr-4 overflow-hidden">
                <Image source={auction.image} className="w-full h-40" contentFit="cover" />
                <View className="p-4">
                  <View className="flex-row items-center gap-2 mb-2 flex-wrap">
                    {auction.status === "live" && (
                      <View className="px-2 py-1 bg-red-500 rounded text-xs flex-row items-center gap-1">
                        <View className="w-1.5 h-1.5 bg-white rounded-full" />
                        <Text className="text-white text-[10px] font-bold">EN VIVO</Text>
                      </View>
                    )}
                    <View className="px-2 py-1 bg-[#6A4F99]/10 rounded">
                      <Text className="text-[#6A4F99] text-[10px] font-bold">{auction.category}</Text>
                    </View>
                  </View>
                  <Text className="font-semibold text-[#333F48] mb-1" numberOfLines={1}>{auction.title}</Text>
                  <Text className="text-xs text-[#A08C79]">{auction.date}</Text>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      {/* Recent Bids */}
      <View className="mb-8">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xl font-bold text-[#333F48]">Pujas Recientes</Text>
          <Link href="/(tabs)/auctions" asChild>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#6A4F99] mr-1 font-medium">Historial</Text>
              <ChevronRight color="#6A4F99" size={16} />
            </TouchableOpacity>
          </Link>
        </View>

        <Card className="border-gray-200 divide-y divide-gray-100 overflow-hidden">
          {recentBids.map((bid, index) => (
            <View key={index} className="p-4 flex-row justify-between items-center">
              <View className="flex-1 mr-4">
                <Text className="text-sm font-medium text-[#333F48] mb-1" numberOfLines={1}>{bid.item}</Text>
                <Text className="text-xs text-[#A08C79]">{bid.time}</Text>
              </View>
              <View className="items-end">
                <Text className="text-sm font-bold text-[#333F48] mb-1">{bid.bid}</Text>
                <View className={`px-2 py-0.5 rounded-full ${bid.status === 'leading' ? 'bg-green-100' : 'bg-red-100'}`}>
                  <Text className={`text-[10px] font-semibold ${bid.status === 'leading' ? 'text-green-800' : 'text-red-800'}`}>
                    {bid.status === 'leading' ? 'Ganando' : 'Superado'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </Card>
      </View>
      <View className="h-10" />
    </ScrollView>
  );
}
