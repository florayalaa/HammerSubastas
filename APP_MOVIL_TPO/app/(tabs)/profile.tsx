import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { User, Mail, MapPin, Globe, Shield, CreditCard, Award, Package, FileText, ShoppingBag, LogOut, BarChart3 } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();
  
  const userProfile = {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    address: "Av. Libertador 5432, Buenos Aires",
    country: "Argentina",
    category: "Oro",
    verified: true,
    memberSince: "Enero 2024",
    paymentMethods: 3,
    totalBids: 45,
    wonAuctions: 8,
    totalSpent: "$125,400",
  };

  const categoryColors: Record<string, string> = {
    "Común": "#A08C79",
    "Especial": "#6A4F99",
    "Plata": "#C0C0C0",
    "Oro": "#C9A063",
    "Platino": "#E2C3BC",
  };

  const stats = [
    { label: "Miembro Desde", value: userProfile.memberSince },
    { label: "Métodos de Pago", value: userProfile.paymentMethods },
    { label: "Pujas Totales", value: userProfile.totalBids },
    { label: "Subastas Ganadas", value: userProfile.wonAuctions },
    { label: "Total Invertido", value: userProfile.totalSpent, highlight: true },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-4" showsVerticalScrollIndicator={false}>
      <View className="mb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-3xl font-bold text-[#333F48] mb-1">Mi Perfil</Text>
          <Text className="text-[#A08C79]">Información de tu cuenta</Text>
        </View>
        <TouchableOpacity onPress={logout} className="p-2 bg-red-100 rounded-full">
          <LogOut color="#ef4444" size={20} />
        </TouchableOpacity>
      </View>

      {/* Category Card */}
      <View className="bg-[#6A4F99] rounded-2xl shadow-lg p-6 mb-6">
        <View className="items-center mb-6">
          <View 
            className="w-20 h-20 rounded-full mb-3 items-center justify-center border-4 border-white"
            style={{ backgroundColor: categoryColors[userProfile.category] }}
          >
            <Award color="white" size={36} />
          </View>
          <Text className="text-2xl font-bold text-white mb-1">Categoría {userProfile.category}</Text>
          {userProfile.verified && (
            <View className="flex-row items-center gap-1 px-3 py-1 bg-white/20 rounded-full">
              <Shield color="white" size={14} />
              <Text className="text-white text-xs">Cuenta Verificada</Text>
            </View>
          )}
        </View>
      </View>

      {/* Profile Info */}
      <Card className="mb-6 border-gray-200 p-5">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-[#333F48]">Información Personal</Text>
          <Link href="/profile/edit" asChild>
            <TouchableOpacity>
              <Text className="text-[#6A4F99] font-semibold">Editar</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="space-y-4">
          <View className="flex-row items-center gap-3">
            <User color="#A08C79" size={20} />
            <View>
              <Text className="text-xs text-[#A08C79] mb-0.5">Nombre Completo</Text>
              <Text className="font-semibold text-[#333F48]">{userProfile.firstName} {userProfile.lastName}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Mail color="#A08C79" size={20} />
            <View>
              <Text className="text-xs text-[#A08C79] mb-0.5">Correo Electrónico</Text>
              <Text className="font-semibold text-[#333F48]">{userProfile.email}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <MapPin color="#A08C79" size={20} />
            <View>
              <Text className="text-xs text-[#A08C79] mb-0.5">Domicilio Legal</Text>
              <Text className="font-semibold text-[#333F48]">{userProfile.address}</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-3">
            <Globe color="#A08C79" size={20} />
            <View>
              <Text className="text-xs text-[#A08C79] mb-0.5">País de Origen</Text>
              <Text className="font-semibold text-[#333F48]">{userProfile.country}</Text>
            </View>
          </View>
        </View>
      </Card>

      {/* Stats (Horizontal) */}
      <View className="mb-6">
        <Text className="text-lg font-bold text-[#333F48] mb-3">Estadísticas de Cuenta</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
          {stats.map((stat, index) => (
            <View 
              key={index} 
              className={`w-36 p-4 rounded-xl mr-3 border ${stat.highlight ? 'bg-[#C9A063] border-[#C9A063]' : 'bg-white border-gray-200'}`}
            >
              <Text className={`text-xs mb-1 ${stat.highlight ? 'text-white/80' : 'text-[#A08C79]'}`}>{stat.label}</Text>
              <Text className={`text-xl font-bold ${stat.highlight ? 'text-white' : 'text-[#333F48]'}`}>{stat.value}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <Card className="mb-8 border-gray-200 p-2">
        <Text className="text-lg font-bold text-[#333F48] mb-2 px-3 pt-3">Acciones Rápidas</Text>
        
        <Link href="/profile/payment-methods" asChild>
          <TouchableOpacity className="flex-row items-center gap-3 p-3 border-b border-gray-100">
            <CreditCard color="#6A4F99" size={20} />
            <Text className="text-[#333F48] font-medium">Medios de Pago</Text>
          </TouchableOpacity>
        </Link>
        
        <Link href="/profile/my-purchases" asChild>
          <TouchableOpacity className="flex-row items-center gap-3 p-3 border-b border-gray-100">
            <ShoppingBag color="#6A4F99" size={20} />
            <Text className="text-[#333F48] font-medium">Mis Compras</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile/my-sales" asChild>
          <TouchableOpacity className="flex-row items-center gap-3 p-3 border-b border-gray-100">
            <Package color="#6A4F99" size={20} />
            <Text className="text-[#333F48] font-medium">Mis Ventas</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile/my-documents" asChild>
          <TouchableOpacity className="flex-row items-center gap-3 p-3 border-b border-gray-100">
            <FileText color="#6A4F99" size={20} />
            <Text className="text-[#333F48] font-medium">Mis Documentos</Text>
          </TouchableOpacity>
        </Link>

        <Link href="/profile/metrics" asChild>
          <TouchableOpacity className="flex-row items-center gap-3 p-3">
            <BarChart3 color="#6A4F99" size={20} />
            <Text className="text-[#333F48] font-medium">Mis Métricas</Text>
          </TouchableOpacity>
        </Link>
      </Card>
      
      <View className="h-10" />
    </ScrollView>
  );
}
