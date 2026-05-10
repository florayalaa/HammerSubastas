import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, CreditCard, Building2, FileCheck, Plus, Trash2, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

export default function PaymentMethods() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "bank" | "check">("card");
  const [showInfoBanner, setShowInfoBanner] = useState(false);

  const paymentMethods = [
    { id: 1, type: "card", name: "Visa **** 4532", status: "verified", details: "Vence 08/2027", icon: CreditCard },
    { id: 2, type: "bank", name: "Banco Santander", status: "verified", details: "Cuenta USD ****7890", icon: Building2 },
    { id: 3, type: "check", name: "Cheque Certificado", status: "verified", details: "Monto: $50,000 USD", icon: FileCheck },
    { id: 4, type: "card", name: "Mastercard **** 8821", status: "pending", details: "Verificación pendiente", icon: CreditCard },
  ];

  const handleConfirmAdd = () => {
    setShowConfirmModal(false);
    setShowAddModal(false);
    Alert.alert("Éxito", "Método de pago agregado. Será verificado en las próximas 24-48 horas.");
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-white pt-14 pb-4 px-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-4">
          <ChevronLeft color="#A08C79" size={24} />
          <Text className="text-[#A08C79] ml-1 font-medium">Volver al Perfil</Text>
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-[#333F48] mb-1">Medios de Pago</Text>
        <Text className="text-[#A08C79]">Gestiona tus métodos de pago para pujar</Text>
      </View>

      <View className="px-4 py-6">
        {/* Info Banner */}
        <TouchableOpacity 
          onPress={() => setShowInfoBanner(!showInfoBanner)}
          className={`flex-row items-center justify-between p-4 bg-blue-50 border border-blue-200 ${showInfoBanner ? 'rounded-t-lg border-b-0' : 'rounded-lg mb-6'}`}
        >
          <View className="flex-row items-center gap-2">
            <Info color="#2563eb" size={20} />
            <Text className="font-semibold text-[#333F48]">Información Importante</Text>
          </View>
          {showInfoBanner ? <ChevronUp color="#2563eb" size={20} /> : <ChevronDown color="#2563eb" size={20} />}
        </TouchableOpacity>

        {showInfoBanner && (
          <View className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg p-4 mb-6">
            <Text className="text-sm text-blue-900 mb-2">• Necesitas un método verificado para pujar.</Text>
            <Text className="text-sm text-blue-900 mb-2">• Aumentan tu categoría de usuario.</Text>
            <Text className="text-sm text-blue-900 mb-2">• Verificaciones toman 24-48 horas.</Text>
            <Text className="text-sm text-blue-900">• Cheques certificados se entregan físicamente.</Text>
          </View>
        )}

        <Button 
          onPress={() => setShowAddModal(true)}
          className="w-full bg-[#6A4F99] h-14 rounded-xl flex-row items-center justify-center mb-6"
        >
          <Plus color="white" size={24} className="mr-2" />
          <Text className="text-white font-bold text-lg">Agregar Método</Text>
        </Button>

        <View className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <View key={method.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="w-12 h-12 bg-[#6A4F99]/10 rounded-lg items-center justify-center mr-4">
                    <Icon color="#6A4F99" size={24} />
                  </View>
                  <View className="flex-1">
                    <View className="flex-row items-center gap-1 mb-1">
                      <Text className="font-bold text-[#333F48]">{method.name}</Text>
                      {method.status === "verified" && <CheckCircle color="#16a34a" size={16} />}
                    </View>
                    <Text className="text-xs text-[#A08C79] mb-2">{method.details}</Text>
                    {method.status === "verified" ? (
                      <View className="self-start px-2 py-1 bg-green-100 rounded-md">
                        <Text className="text-green-800 text-[10px] font-bold">Verificado</Text>
                      </View>
                    ) : (
                      <View className="self-start px-2 py-1 bg-yellow-100 rounded-md">
                        <Text className="text-yellow-800 text-[10px] font-bold">Pendiente</Text>
                      </View>
                    )}
                  </View>
                </View>
                <TouchableOpacity 
                  onPress={() => {
                    Alert.alert("Confirmar", "¿Eliminar método de pago?", [
                      { text: "Cancelar", style: "cancel" },
                      { text: "Eliminar", style: "destructive" }
                    ])
                  }}
                  className="p-3"
                >
                  <Trash2 color="#ef4444" size={20} />
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        <View className="h-10" />
      </View>

      {/* Modal Agregar Método */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6 h-[85%]">
            <Text className="text-2xl font-bold text-[#333F48] mb-6">Agregar Método</Text>
            
            <Text className="text-sm font-medium text-[#333F48] mb-3">Tipo de Método</Text>
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity 
                onPress={() => setPaymentType("card")}
                className={`flex-1 p-3 border-2 rounded-xl items-center ${paymentType === "card" ? "border-[#6A4F99] bg-[#6A4F99]/10" : "border-gray-200"}`}
              >
                <CreditCard color={paymentType === "card" ? "#6A4F99" : "#A08C79"} size={24} className="mb-2" />
                <Text className={`text-xs font-medium ${paymentType === "card" ? "text-[#6A4F99]" : "text-[#A08C79]"}`}>Tarjeta</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPaymentType("bank")}
                className={`flex-1 p-3 border-2 rounded-xl items-center ${paymentType === "bank" ? "border-[#6A4F99] bg-[#6A4F99]/10" : "border-gray-200"}`}
              >
                <Building2 color={paymentType === "bank" ? "#6A4F99" : "#A08C79"} size={24} className="mb-2" />
                <Text className={`text-xs font-medium ${paymentType === "bank" ? "text-[#6A4F99]" : "text-[#A08C79]"}`}>Banco</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setPaymentType("check")}
                className={`flex-1 p-3 border-2 rounded-xl items-center ${paymentType === "check" ? "border-[#6A4F99] bg-[#6A4F99]/10" : "border-gray-200"}`}
              >
                <FileCheck color={paymentType === "check" ? "#6A4F99" : "#A08C79"} size={24} className="mb-2" />
                <Text className={`text-xs font-medium ${paymentType === "check" ? "text-[#6A4F99]" : "text-[#A08C79]"}`}>Cheque</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
              {paymentType === "card" && (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm text-[#333F48] mb-2">Número de Tarjeta</Text>
                    <TextInput placeholder="1234 5678 9012 3456" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" keyboardType="numeric" />
                  </View>
                  <View className="flex-row gap-4">
                    <View className="flex-1">
                      <Text className="text-sm text-[#333F48] mb-2">Vencimiento</Text>
                      <TextInput placeholder="MM/AA" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm text-[#333F48] mb-2">CVV</Text>
                      <TextInput placeholder="123" secureTextEntry className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" keyboardType="numeric" />
                    </View>
                  </View>
                </View>
              )}
              {/* Omitidos bank y check form por brevedad visual */}
              {paymentType === "bank" && (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm text-[#333F48] mb-2">Nombre del Banco</Text>
                    <TextInput placeholder="Ej: Banco Santander" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" />
                  </View>
                  <View>
                    <Text className="text-sm text-[#333F48] mb-2">Número de Cuenta</Text>
                    <TextInput placeholder="1234567890" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" keyboardType="numeric" />
                  </View>
                </View>
              )}
              {paymentType === "check" && (
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm text-[#333F48] mb-2">Número de Cheque</Text>
                    <TextInput placeholder="CH-123456" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" />
                  </View>
                  <View>
                    <Text className="text-sm text-[#333F48] mb-2">Monto (USD)</Text>
                    <TextInput placeholder="50000" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#333F48]" keyboardType="numeric" />
                  </View>
                  <Text className="text-xs text-[#A08C79] mt-2">El cheque debe entregarse físicamente antes de la subasta.</Text>
                </View>
              )}
            </ScrollView>

            <View className="flex-row gap-3">
              <Button variant="secondary" onPress={() => setShowAddModal(false)} className="flex-1 h-12 rounded-xl">Cancelar</Button>
              <Button onPress={() => setShowConfirmModal(true)} className="flex-1 bg-[#6A4F99] h-12 rounded-xl">Agregar</Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Confirmación */}
      <Modal visible={showConfirmModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center px-6">
          <View className="bg-white rounded-2xl p-6 shadow-xl">
            <Text className="text-xl font-bold text-[#333F48] mb-3">Confirmar Método</Text>
            <Text className="text-sm text-[#A08C79] mb-6">
              El método de pago será enviado para verificación (24-48 horas).
            </Text>
            <View className="flex-row gap-3">
              <Button variant="secondary" onPress={() => setShowConfirmModal(false)} className="flex-1">Volver</Button>
              <Button onPress={handleConfirmAdd} className="flex-1 bg-[#6A4F99]">Confirmar</Button>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
