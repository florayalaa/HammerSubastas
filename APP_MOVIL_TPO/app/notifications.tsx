import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, DollarSign, PackageCheck, AlertTriangle } from 'lucide-react-native';

export default function Notifications() {
  const router = useRouter();

  const notifications = [
    {
      id: 1,
      title: "Subasta Ganada",
      message: "¡Felicidades! Has ganado la subasta por el 'Juego de Té de Plata'. El importe a pagar es de $45,000 (Puja) + $4,500 (10% Comisión) + $200 (Envío). Total: $49,700.",
      time: "Hace 2 horas",
      icon: DollarSign,
      color: "bg-green-100",
      iconColor: "#16a34a",
      read: false
    },
    {
      id: 2,
      title: "Artículo Aprobado",
      message: "Tu 'Cuadro de Artista Local' ha pasado la inspección de nuestros expertos. Revisa la sección 'Mis Ventas' para aceptar la cotización y póliza.",
      time: "Ayer",
      icon: PackageCheck,
      color: "bg-blue-100",
      iconColor: "#2563eb",
      read: true
    },
    {
      id: 3,
      title: "Aviso de Multa",
      message: "No se pudieron procesar los fondos de tu cheque para el artículo 'Reloj Omega Vintage'. Se te ha aplicado una multa del 10%.",
      time: "Hace 3 días",
      icon: AlertTriangle,
      color: "bg-red-100",
      iconColor: "#ef4444",
      read: true
    }
  ];

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white pt-14 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Notificaciones</Text>
        <Text className="text-[#A08C79]">Tus mensajes y avisos privados</Text>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {notifications.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Bell color="#CBD5E1" size={48} className="mb-4" />
            <Text className="text-[#333F48] text-lg font-bold">No tienes notificaciones</Text>
            <Text className="text-[#A08C79] mt-1 text-center">Te avisaremos cuando haya actualizaciones sobre tus subastas o artículos.</Text>
          </View>
        ) : (
          <View className="p-4 space-y-3">
            {notifications.map((notif) => {
              const Icon = notif.icon;
              return (
                <TouchableOpacity 
                  key={notif.id} 
                  className={`p-4 rounded-xl flex-row shadow-sm border ${notif.read ? 'bg-white border-gray-100' : 'bg-blue-50/50 border-blue-200'}`}
                >
                  <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${notif.color}`}>
                    <Icon color={notif.iconColor} size={24} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className={`font-bold text-base ${notif.read ? 'text-[#333F48]' : 'text-blue-900'}`}>{notif.title}</Text>
                      <Text className="text-xs text-[#A08C79]">{notif.time}</Text>
                    </View>
                    <Text className={`text-sm leading-relaxed ${notif.read ? 'text-gray-600' : 'text-blue-800'}`}>
                      {notif.message}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
