import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Link } from 'expo-router';
import { Search, Calendar, Users, DollarSign, Lock, Play } from 'lucide-react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/context/AuthContext';
import { Card } from '@/components/ui/Card';
import { apiGet } from '@/app/lib/api';

export default function Auctions() {
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useAuth();
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await apiGet('/subastas');
        if (res && Array.isArray(res)) {
          // Mapeamos los datos del backend al formato que necesita el frontend
          const formattedAuctions = res.map((a: any) => ({
            id: a.id,
            title: a.title,
            date: new Date(a.startDate).toLocaleDateString(),
            time: new Date(a.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            category: a.category || "General",
            currency: a.currency || "USD",
            items: 0, // Aún no hay artículos implementados
            startingBid: `$${a.startingPrice}`,
            status: a.status === 'ACTIVE' ? 'live' : 'upcoming',
            image: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80",
          }));
          setAuctions(formattedAuctions);
        }
      } catch (error) {
        console.error("Error al obtener subastas:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAuctions();
  }, []);

  const filteredAuctions = auctions.filter((auction) =>
    auction.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#6A4F99" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-6">
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Subastas Disponibles</Text>
        <Text className="text-[#A08C79]">Explora todas las subastas activas y próximas</Text>
      </View>

      <View className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <Text className="text-sm font-medium text-slate-700 mb-2">Buscar</Text>
        <View className="relative justify-center">
          <View className="absolute left-3 z-10"><Search color="#A08C79" size={20} /></View>
          <TextInput
            className="w-full h-10 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
            placeholder="Buscar subastas..."
            placeholderTextColor="#94a3b8"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
      </View>

      <Text className="text-[#A08C79] mb-4">
        Mostrando <Text className="font-semibold text-[#333F48]">{filteredAuctions.length}</Text> subastas
      </Text>

      {filteredAuctions.length === 0 ? (
        <View className="items-center justify-center py-10">
          <Text className="text-[#A08C79] text-lg">No hay subastas disponibles</Text>
        </View>
      ) : (
        <View className="gap-6 mb-8">
          {filteredAuctions.map((auction) => (
            <Card key={auction.id} className="overflow-hidden border-gray-200">
              <Image source={auction.image} className="w-full h-48" contentFit="cover" />
              <View className="p-5">
                <View className="flex-row items-center gap-2 mb-3 flex-wrap">
                  {auction.status === "live" && (
                    <View className="px-2 py-1 bg-red-500 rounded flex-row items-center gap-1">
                      <View className="w-1.5 h-1.5 bg-white rounded-full" />
                      <Text className="text-white text-[10px] font-bold">EN VIVO</Text>
                    </View>
                  )}
                  <View className="px-2 py-1 bg-[#6A4F99]/10 rounded">
                    <Text className="text-[#6A4F99] text-[10px] font-bold">{auction.category}</Text>
                  </View>
                  <View className="px-2 py-1 bg-[#C9A063]/10 rounded">
                    <Text className="text-[#C9A063] text-[10px] font-bold">{auction.currency}</Text>
                  </View>
                </View>

                <Text className="text-xl font-bold text-[#333F48] mb-3">{auction.title}</Text>

                <View className="space-y-2 mb-4">
                  <View className="flex-row items-center gap-2">
                    <Calendar size={16} color="#A08C79" />
                    <Text className="text-sm text-[#A08C79]">{auction.date} • {auction.time}</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Users size={16} color="#A08C79" />
                    <Text className="text-sm text-[#A08C79]">{auction.items} artículos</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <DollarSign size={16} color="#A08C79" />
                    {isAuthenticated ? (
                      <Text className="text-sm text-[#A08C79]">Desde {auction.startingBid}</Text>
                    ) : (
                      <View className="flex-row items-center">
                        <Lock size={14} color="#A08C79" className="mr-1" />
                        <Link href="/(auth)/login" asChild>
                          <TouchableOpacity><Text className="text-[#6A4F99] text-sm underline">Inicia sesión</Text></TouchableOpacity>
                        </Link>
                      </View>
                    )}
                  </View>
                </View>

                <View className="flex-row gap-3 mt-2">
                  <Link href={`/auctions/${auction.id}`} asChild>
                    <TouchableOpacity className="flex-1 bg-[#6A4F99] py-3 rounded-lg items-center">
                      <Text className="text-white font-semibold">Ver Catálogo</Text>
                    </TouchableOpacity>
                  </Link>
                  {auction.status === "live" && (
                    <Link href={`/auctions/live/${auction.id}`} asChild>
                      <TouchableOpacity className="flex-1 bg-red-500 py-3 rounded-lg flex-row justify-center items-center gap-2">
                        <Play size={16} color="white" />
                        <Text className="text-white font-semibold">Participar</Text>
                      </TouchableOpacity>
                    </Link>
                  )}
                </View>
              </View>
            </Card>
          ))}
        </View>
      )}
      <View className="h-10" />
    </ScrollView>
  );
}
