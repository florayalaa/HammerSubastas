import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Modal, FlatList, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, HandCoins, CreditCard, FileText, Building2, ChevronDown } from 'lucide-react-native';
import { Image } from 'expo-image';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { socketService } from '@/services/socket';
import { API_BASE_URL } from '@/app/lib/api';

const API_URL = API_BASE_URL.replace('/api', '');

export default function LiveAuction() {
  const { id, itemId } = useLocalSearchParams<{ id: string; itemId?: string }>();
  const router = useRouter();
  const { user, token, isAuthenticated } = useAuth();
  
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [metodosPago, setMetodosPago] = useState<any[]>([]);
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<any>(null);
  const [showMetodoPicker, setShowMetodoPicker] = useState(false);
  const [recentBids, setRecentBids] = useState<{user: string, amount: number, id: string}[]>([]);
  const [esperandoOtroPujador, setEsperandoOtroPujador] = useState(false);

  const [currentItem, setCurrentItem] = useState({
    title: "",
    currentBid: 0,
    basePrice: 0,
    highestBidder: "",
    image: null as string | null,
    timeRemaining: "01:00",
  });

  const [activeItem, setActiveItem] = useState<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !token) return;
    fetch(`${API_URL}/api/pagos`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const metodos = data?.data ?? [];
        setMetodosPago(metodos);
        if (metodos.length > 0) setMetodoPagoSeleccionado(metodos[0]);
      })
      .catch(() => {});
  }, [isAuthenticated, token]);

  const [endTime, setEndTime] = useState(() => new Date(Date.now() + 3 * 60 * 1000));
  const [tiempoAgotado, setTiempoAgotado] = useState(false);

  useEffect(() => {
    setTiempoAgotado(false);
    const interval = setInterval(() => {
      const distance = endTime.getTime() - Date.now();

      if (distance <= 0) {
        clearInterval(interval);
        setTiempoAgotado(true);
        setCurrentItem(prev => ({ ...prev, timeRemaining: "00:00" }));
        return;
      }

      const minutes = Math.floor(distance / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      setCurrentItem(prev => ({
        ...prev,
        timeRemaining: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  // Timer propio de 1 minuto: cada vez que es "tu turno" para pujar (no estás bloqueado
  // esperando a otro postor) tenés 1 minuto. Si se agota sin que puje, se bloquea el botón
  // (mismo estado que "esperando otro pujador"), pero esto es local a este usuario —
  // no toca el timer general de 3 min del ítem, que sigue tomando la última puja real.
  const [miTiempoRestante, setMiTiempoRestante] = useState(60);

  useEffect(() => {
    if (esperandoOtroPujador) return;

    setMiTiempoRestante(60);
    const interval = setInterval(() => {
      setMiTiempoRestante(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setEsperandoOtroPujador(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [esperandoOtroPujador]);

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const res = await fetch(`${API_URL}/api/subastas/${id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.catalogItems && data.catalogItems.length > 0) {
            const firstItem = itemId
              ? (data.catalogItems.find((it: any) => it.id === itemId) ?? data.catalogItems[0])
              : data.catalogItems[0];
            setActiveItem(firstItem);

            setCurrentItem(prev => ({
              ...prev,
              title: firstItem.title,
              currentBid: firstItem.currentPrice,
              basePrice: firstItem.startingPrice,
              image: firstItem.image ? `${API_BASE_URL}${firstItem.image}` : null,
            }));

            // Obtenemos las pujas de este artículo
            const bidsRes = await fetch(`${API_URL}/api/pujos/item/${firstItem.id}`, {
              headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (bidsRes.ok) {
              const bidsData = await bidsRes.json();
              if (bidsData.length > 0) {
                setEndTime(new Date(Date.now() + 3 * 60 * 1000));
                setCurrentItem(prev => ({
                  ...prev,
                  currentBid: bidsData[0].amount,
                  highestBidder: bidsData[0].user?.firstName ? `${bidsData[0].user.firstName}***` : 'Desconocido',
                }));
                setRecentBids(bidsData.slice(0, 5).map((b: any) => ({
                  user: b.user?.firstName ? `${b.user.firstName}***` : 'Desconocido',
                  amount: b.amount,
                  id: b.id
                })));
              } else {
                setRecentBids([]);
                setCurrentItem(prev => ({ ...prev, highestBidder: 'Nadie — ¡Sé el primero!' }));
              }
            }

            // Registro automático a la subasta por si acaso
            if (token) {
              await fetch(`${API_URL}/api/subastas/${id}/registrar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
              }).catch(() => {}); // ignoramos errores (ej: ya registrado)
            }

            // Conectamos el socket para este artículo (enviamos token para control de sesión única)
            socketService.connect();
            socketService.joinAuction(firstItem.id, token ?? undefined);
          }
        }
      } catch (e) {
        console.warn("Error al obtener subasta", e);
      }
    };
    if (id) fetchAuction();

    const handleNewBid = (bid: any) => {
      setCurrentItem(prev => ({
        ...prev,
        currentBid: bid.amount,
        highestBidder: bid.user?.firstName ? `${bid.user.firstName}***` : 'Desconocido',
      }));
      setRecentBids(prev =>
        [{ user: bid.user?.firstName ? `${bid.user.firstName}***` : 'Desconocido', amount: bid.amount, id: bid.id || Date.now().toString() }, ...prev].slice(0, 5)
      );
      // Solo la puja de OTRO participante libera el bloqueo de turno
      if (!(user?.id && bid.user?.id && String(user.id) === String(bid.user.id))) {
        setEsperandoOtroPujador(false);
      }
      setEndTime(new Date(Date.now() + 3 * 60 * 1000));
    };

    const handleKicked = ({ motivo }: { motivo: string }) => {
      socketService.offNewBid(handleNewBid);
      socketService.offKicked();
      socketService.offAuctionEnded();
      socketService.disconnect();
      Alert.alert('Sesión finalizada', motivo, [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    };

    const handleAuctionEnded = (data: { itemId: string; winnerId: string; finalAmount: number }) => {
      const soyGanador = user?.id && String(user.id) === data.winnerId;
      Alert.alert(
        soyGanador ? '🏆 ¡Ganaste!' : 'Subasta finalizada',
        soyGanador
          ? `Ganaste el artículo por $${Number(data.finalAmount).toLocaleString('es-AR')}. Podés ver tu compra en "Mis Compras".`
          : `La subasta ha finalizado. Monto final: $${Number(data.finalAmount).toLocaleString('es-AR')}.`,
        [{ text: 'Aceptar', onPress: () => router.back() }],
      );
    };

    socketService.onNewBid(handleNewBid);
    socketService.onKicked(handleKicked);
    socketService.onAuctionEnded(handleAuctionEnded);

    return () => {
      socketService.offNewBid(handleNewBid);
      socketService.offKicked();
      socketService.offAuctionEnded();
      if (activeItem) {
        socketService.leaveAuction(activeItem.id);
      }
      socketService.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, itemId]);

  const esPropio = !!(activeItem?.ownerId && user?.id && String(user.id) === String(activeItem.ownerId));
  const isExempt = user?.category === 'Oro' || user?.category === 'Platino';
  const minBid = currentItem.currentBid + (currentItem.basePrice * 0.01);
  const maxBid = currentItem.currentBid + (currentItem.basePrice * 0.20);

  const handleBid = async () => {
    if (esPropio) return;
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
      const response = await fetch(`${API_URL}/api/pujos/item/${activeItem.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ amount, metodoPagoId: metodoPagoSeleccionado?.identificador })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar puja');
      }

      setBidAmount('');
      // Bloquear hasta que otro usuario puje (socket event liberará esto)
      setEsperandoOtroPujador(true);
      // Refrescamos las pujas inmediatamente (fallback ante fallas del socket)
      if (activeItem) {
        const bidsRes = await fetch(`${API_URL}/api/pujos/item/${activeItem.id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (bidsRes.ok) {
          const bidsData = await bidsRes.json();
          if (bidsData.length > 0) {
            setCurrentItem(prev => ({
              ...prev,
              currentBid: bidsData[0].amount,
              highestBidder: bidsData[0].user?.firstName ? `${bidsData[0].user.firstName}***` : 'Desconocido',
            }));
            setRecentBids(bidsData.slice(0, 5).map((b: any) => ({
              user: b.user?.firstName ? `${b.user.firstName}***` : 'Desconocido',
              amount: b.amount,
              id: b.id
            })));
          }
        }
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Error de red al pujar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View className="pt-12 pb-4 px-4 flex-row items-center justify-between border-b border-gray-800 bg-gray-900 z-10">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 items-center justify-center bg-gray-800 rounded-full">
          <ChevronLeft color="white" size={24} />
        </TouchableOpacity>
        <View className="items-center">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-red-500" />
            <Text className="text-white font-bold tracking-widest">EN VIVO</Text>
          </View>
        </View>
        <View className="w-10 h-10" />
      </View>

      <ScrollView className="flex-1">
        <Image
          source={{ uri: currentItem.image ?? "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80" }}
          className="w-full h-72"
          contentFit="cover"
        />
        
        <View className="p-6 -mt-6 bg-gray-900 rounded-t-3xl">
          <Text className="text-2xl font-bold text-white mb-4">{currentItem.title}</Text>
          
          <View className="bg-gray-800 rounded-2xl p-6 mb-6 items-center">
            {isAuthenticated ? (
              <>
                <Text className="text-gray-400 mb-2">Puja Actual</Text>
                <Text className="text-5xl font-bold text-green-400 mb-1">${currentItem.currentBid}</Text>
                <Text className="text-gray-500 text-xs mb-3">Precio Base: ${currentItem.basePrice}</Text>
                <Text className="text-gray-400">Por: <Text className="font-bold text-white">{currentItem.highestBidder}</Text></Text>
              </>
            ) : (
              <View className="items-center py-2">
                <Text className="text-gray-400 mb-2">Puja Oculta</Text>
                <Text className="text-xl font-bold text-white mb-2 text-center">Iniciá sesión para ver los precios de esta subasta</Text>
              </View>
            )}
          </View>

          <View className="flex-row items-center justify-center gap-2 mb-6">
            {tiempoAgotado ? (
              <Text className="text-gray-500 font-bold text-xl">Tiempo agotado</Text>
            ) : (
              <>
                <Text className={`font-bold text-2xl ${Number(currentItem.timeRemaining?.split(':')[0]) === 0 && Number(currentItem.timeRemaining?.split(':')[1]) < 10 ? 'text-red-500' : 'text-orange-400'}`}>
                  {currentItem.timeRemaining}
                </Text>
                <Text className="text-gray-400">para pujar</Text>
              </>
            )}
          </View>

          {isAuthenticated && (
            <>
              <Text className="text-white font-bold mb-4">Actividad Reciente</Text>
              <View className="space-y-3 mb-8">
                {recentBids.map((bid) => (
                  <View key={bid.id} className="flex-row items-center justify-between">
                    <Text className="text-gray-300">{bid.user}</Text>
                    <Text className="text-green-400 font-bold">${bid.amount}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Bid Actions */}
      <View className="bg-gray-900 border-t border-gray-800 p-4 pb-8">
        {esPropio ? (
          <View className="items-center py-2">
            <Text className="text-gray-400 text-center">No podés pujar por tu propio artículo.</Text>
          </View>
        ) : isAuthenticated ? (
          <>
            {esperandoOtroPujador && (
              <Text className="text-yellow-400 text-xs mb-2 text-center font-semibold">
                Esperando a que alguien más puje...
              </Text>
            )}
            {!esperandoOtroPujador && (
              <Text className="text-orange-400 text-xs mb-2 text-center font-semibold">
                Tenés {`${Math.floor(miTiempoRestante / 60)}:${String(miTiempoRestante % 60).padStart(2, '0')}`} para pujar
              </Text>
            )}
            {!isExempt && !esperandoOtroPujador && (
              <Text className="text-gray-400 text-xs mb-2 text-center">
                Límites de puja para tu categoría: ${minBid.toLocaleString('es-AR')} - ${maxBid.toLocaleString('es-AR')}
              </Text>
            )}
            <View className="flex-row gap-3 mb-3">
              <Button
                variant="secondary"
                className="flex-1 bg-gray-800 border-gray-700 h-12"
                disabled={isSubmitting || tiempoAgotado || esperandoOtroPujador}
                onPress={() => setBidAmount((currentItem.currentBid + 500).toString())}
              >
                <Text className="text-white font-bold">+ $500</Text>
              </Button>
              <Button
                variant="secondary"
                className="flex-1 bg-gray-800 border-gray-700 h-12"
                disabled={isSubmitting || tiempoAgotado || esperandoOtroPujador}
                onPress={() => setBidAmount((currentItem.currentBid + 1000).toString())}
              >
                <Text className="text-white font-bold">+ $1000</Text>
              </Button>
            </View>
            {metodosPago.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowMetodoPicker(true)}
                className="flex-row items-center bg-gray-800 rounded-xl px-4 h-12 border border-gray-700 mb-3"
              >
                {(() => {
                  const m = metodoPagoSeleccionado;
                  if (!m) return <Text className="text-gray-400 flex-1 text-sm">Seleccioná un medio de pago</Text>;
                  const esTarjeta = m.tipo?.includes('tarjeta');
                  const esCheque = m.tipo === 'cheque';
                  const Icono = esTarjeta ? CreditCard : esCheque ? FileText : Building2;
                  const color = esTarjeta ? '#6A4F99' : esCheque ? '#C9A063' : '#4A7C59';
                  const label = esTarjeta
                    ? `Tarjeta ···· ${String(m.numero).slice(-4)}`
                    : esCheque ? `Cheque Nº ${m.numero}` : 'Cuenta Bancaria';
                  return (
                    <>
                      <Icono color={color} size={16} />
                      <Text className="text-white text-sm flex-1 ml-2">{label}</Text>
                      <ChevronDown color="#9CA3AF" size={16} />
                    </>
                  );
                })()}
              </TouchableOpacity>
            )}

            <View className="flex-row items-center gap-3">
              <View className={`flex-1 flex-row items-center justify-center rounded-xl px-4 h-14 border ${(tiempoAgotado || esperandoOtroPujador) ? 'bg-gray-900 border-gray-800' : 'bg-gray-800 border-gray-700'}`}>
                <Text className="text-gray-400 text-lg mr-2">$</Text>
                <TextInput
                  value={bidAmount}
                  onChangeText={(t) => { setBidAmount(t); setErrorMsg(''); }}
                  placeholder={(tiempoAgotado || esperandoOtroPujador) ? '—' : 'Monto a pujar'}
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  className="text-white text-lg text-center"
                  style={{ paddingVertical: 0, height: 56, textAlignVertical: 'center', minWidth: 100 }}
                  editable={!isSubmitting && !tiempoAgotado && !esperandoOtroPujador}
                />
              </View>
              <TouchableOpacity
                onPress={handleBid}
                disabled={isSubmitting || tiempoAgotado || esperandoOtroPujador}
                className={`w-14 h-14 rounded-xl items-center justify-center ${(isSubmitting || tiempoAgotado || esperandoOtroPujador) ? 'bg-gray-700' : 'bg-[#6A4F99]'}`}
              >
                {isSubmitting ? <ActivityIndicator color="white" /> : <HandCoins color={(tiempoAgotado || esperandoOtroPujador) ? '#6B7280' : 'white'} size={24} />}
              </TouchableOpacity>
            </View>
            {tiempoAgotado && (
              <Text className="text-gray-500 text-xs mt-2 text-center">El tiempo para pujar se agotó. Esperá una nueva puja para que el reloj se reinicie.</Text>
            )}
            {errorMsg ? <Text className="text-red-400 text-xs mt-2 text-center">{errorMsg}</Text> : null}
          </>
        ) : (
          <View className="items-center py-2">
            <Button onPress={() => router.push('/(autenticacion)/iniciar-sesion')} className="w-full bg-[#6A4F99] h-12">
              Iniciar Sesión para Pujar
            </Button>
          </View>
        )}
      </View>

      <Modal visible={showMetodoPicker} transparent animationType="slide" onRequestClose={() => setShowMetodoPicker(false)}>
        <TouchableOpacity className="flex-1 bg-black/60" activeOpacity={1} onPress={() => setShowMetodoPicker(false)} />
        <View className="bg-gray-900 rounded-t-3xl px-4 pt-4 pb-8 border-t border-gray-700">
          <Text className="text-white font-bold text-base mb-4">Medio de pago</Text>
          <FlatList
            data={metodosPago}
            keyExtractor={(m) => String(m.identificador)}
            renderItem={({ item: m }) => {
              const esTarjeta = m.tipo?.includes('tarjeta');
              const esCheque = m.tipo === 'cheque';
              const Icono = esTarjeta ? CreditCard : esCheque ? FileText : Building2;
              const color = esTarjeta ? '#6A4F99' : esCheque ? '#C9A063' : '#4A7C59';
              const label = esTarjeta
                ? `Tarjeta ···· ${String(m.numero).slice(-4)}`
                : esCheque ? `Cheque Nº ${m.numero}` : 'Cuenta Bancaria';
              const seleccionado = metodoPagoSeleccionado?.identificador === m.identificador;
              return (
                <TouchableOpacity
                  onPress={() => { setMetodoPagoSeleccionado(m); setShowMetodoPicker(false); }}
                  className={`flex-row items-center p-4 rounded-xl mb-2 border ${seleccionado ? 'border-[#6A4F99] bg-[#6A4F99]/10' : 'border-gray-700 bg-gray-800'}`}
                >
                  <Icono color={color} size={20} />
                  <View className="ml-3 flex-1">
                    <Text className="text-white font-semibold text-sm">{label}</Text>
                    {m.titular ? <Text className="text-gray-400 text-xs">{m.titular}</Text> : null}
                    {esCheque && m.montoGarantia ? (
                      <Text className="text-[#C9A063] text-xs">Garantía: ${Number(m.montoGarantia).toLocaleString('es-AR')}</Text>
                    ) : null}
                  </View>
                  {seleccionado && <View className="w-2 h-2 rounded-full bg-[#6A4F99]" />}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
