import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Send, Users, HandCoins } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { socketService } from '@/services/socket';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export default function LiveAuction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user, token } = useAuth();
  
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [recentBids, setRecentBids] = useState<{user: string, amount: number, id: string}[]>([
    { user: 'User***89', amount: 45000, id: '1' },
    { user: 'User***21', amount: 44500, id: '2' },
    { user: 'User***55', amount: 43000, id: '3' },
  ]);

  const [currentItem, setCurrentItem] = useState({
    title: "Anillo de Diamantes Art Déco",
    currentBid: 45000,
    basePrice: 40000,
    highestBidder: "User***89",
    image: "https://images.unsplash.com/photo-1742240439165-60790db1ee93?auto=format&fit=crop&w=800&q=80",
    timeRemaining: "00:02:45"
  });

  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auctions/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.catalogItems && data.catalogItems.length > 0) {
            const firstItem = data.catalogItems[0];
            setActiveItem(firstItem);
            
            setCurrentItem(prev => ({
              ...prev,
              title: firstItem.title,
              currentBid: firstItem.currentPrice,
              basePrice: firstItem.startingPrice,
              image: "https://images.unsplash.com/photo-1742240439165-60790db1ee93?auto=format&fit=crop&w=800&q=80"
            }));

            // Fetch bids for THIS item
            const bidsRes = await fetch(`${API_URL}/api/bids/item/${firstItem.id}`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (bidsRes.ok) {
              const bidsData = await bidsRes.json();
              if (bidsData.length > 0) {
                setCurrentItem(prev => ({
                  ...prev,
                  highestBidder: bidsData[0].user?.firstName ? `${bidsData[0].user.firstName}***` : 'Unknown',
                }));
                setRecentBids(bidsData.slice(0, 5).map((b: any) => ({
                  user: b.user?.firstName ? `${b.user.firstName}***` : 'Unknown',
                  amount: b.amount,
                  id: b.id
                })));
              } else {
                 setRecentBids([]);
                 setCurrentItem(prev => ({ ...prev, highestBidder: 'Nadie (Sé el primero)' }));
              }
            }

            // Socket connect for this item
            socketService.connect();
            socketService.joinAuction(firstItem.id);
          }
        }
      } catch (e) {
        console.error("Error fetching auction", e);
      }
    };
    if (id) fetchAuction();

    const handleNewBid = (bid: any) => {
      // Update the current item with the new highest bid
      setCurrentItem(prev => ({
        ...prev,
        currentBid: bid.amount,
        highestBidder: bid.user?.firstName ? `${bid.user.firstName}***` : 'Unknown'
      }));

      // Add to recent bids list
      setRecentBids(prev => {
        const newBids = [
          { 
            user: bid.user?.firstName ? `${bid.user.firstName}***` : 'Unknown', 
            amount: bid.amount,
            id: bid.id || Date.now().toString()
          },
          ...prev
        ];
        return newBids.slice(0, 5); // Keep only the latest 5
      });
    };

    socketService.onNewBid(handleNewBid);

    return () => {
      socketService.offNewBid(handleNewBid);
      if (activeItem) {
        socketService.leaveAuction(activeItem.id);
      }
      socketService.disconnect();
    };
  }, [id]);

  const isExempt = user?.category === 'Oro' || user?.category === 'Platino';
  const minBid = currentItem.currentBid + (currentItem.basePrice * 0.01);
  const maxBid = currentItem.currentBid + (currentItem.basePrice * 0.20);

  const handleBid = async () => {
    const amount = Number(bidAmount);
    if (!amount || amount <= currentItem.currentBid) {
      setErrorMsg("La puja debe ser mayor a la actual.");
      return;
    }
    
    if (!isExempt) {
      if (amount < minBid) {
        setErrorMsg(`Mínimo permitido: $${minBid}`);
        return;
      }
      if (amount > maxBid) {
        setErrorMsg(`Máximo permitido: $${maxBid}`);
        return;
      }
    }

    setErrorMsg('');
    setIsSubmitting(true);
    
    try {
      if (!activeItem) throw new Error("Item no cargado");
      const response = await fetch(`${API_URL}/api/bids/item/${activeItem.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar puja');
      }

      setBidAmount('');
      // Alert.alert("Éxito", "Puja enviada correctamente."); // Socket will handle UI update
    } catch (error: any) {
      setErrorMsg(error.message || "Error de red al pujar");
    } finally {
      setIsSubmitting(false);
    }
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
            <Text className="text-5xl font-bold text-green-400 mb-1">${currentItem.currentBid}</Text>
            <Text className="text-gray-500 text-xs mb-3">Precio Base: ${currentItem.basePrice}</Text>
            <Text className="text-gray-400">Por: <Text className="font-bold text-white">{currentItem.highestBidder}</Text></Text>
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-6">
            <Text className="text-red-400 font-bold text-xl">{currentItem.timeRemaining}</Text>
            <Text className="text-gray-400">restantes</Text>
          </View>

          <Text className="text-white font-bold mb-4">Actividad Reciente</Text>
          <View className="space-y-3 mb-8">
            {recentBids.map((bid) => (
              <View key={bid.id} className="flex-row items-center justify-between">
                <Text className="text-gray-300">{bid.user}</Text>
                <Text className="text-green-400 font-bold">${bid.amount}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bid Actions */}
      <View className="absolute bottom-0 w-full bg-gray-900 border-t border-gray-800 p-4 pb-8">
        {!isExempt && (
          <Text className="text-gray-400 text-xs mb-3 text-center">
            Límites de puja para tu categoría: ${minBid} - ${maxBid}
          </Text>
        )}
        <View className="flex-row gap-3 mb-4">
          <Button 
            variant="secondary" 
            className="flex-1 bg-gray-800 border-gray-700 h-12"
            disabled={isSubmitting}
            onPress={() => setBidAmount((currentItem.currentBid + 500).toString())}
          >
            <Text className="text-white font-bold">+ $500</Text>
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1 bg-gray-800 border-gray-700 h-12"
            disabled={isSubmitting}
            onPress={() => setBidAmount((currentItem.currentBid + 1000).toString())}
          >
            <Text className="text-white font-bold">+ $1000</Text>
          </Button>
        </View>
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-800 rounded-xl px-4 h-14 border border-gray-700">
            <Text className="text-gray-400 text-lg mr-2">$</Text>
            <TextInput
              value={bidAmount}
              onChangeText={(t) => { setBidAmount(t); setErrorMsg(''); }}
              placeholder="Monto a pujar"
              placeholderTextColor="#9CA3AF"
              keyboardType="numeric"
              className="flex-1 text-white text-lg h-full"
              editable={!isSubmitting}
            />
          </View>
          <TouchableOpacity 
            onPress={handleBid}
            disabled={isSubmitting}
            className={`w-14 h-14 rounded-xl items-center justify-center ${isSubmitting ? 'bg-gray-600' : 'bg-[#6A4F99]'}`}
          >
            {isSubmitting ? <ActivityIndicator color="white" /> : <HandCoins color="white" size={24} />}
          </TouchableOpacity>
        </View>
        {errorMsg ? <Text className="text-red-400 text-xs mt-2 text-center">{errorMsg}</Text> : null}
      </View>
    </View>
  );
}
