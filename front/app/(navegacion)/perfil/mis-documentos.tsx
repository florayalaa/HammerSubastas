import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FileText, CheckCircle, Clock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { EncabezadoVolver } from '@/components/EncabezadoVolver';

export default function MyDocuments() {
  const { user } = useAuth();

  const verificado = user?.verified ?? false;

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
    <EncabezadoVolver />
    <ScrollView style={{ flex: 1, backgroundColor: '#f9fafb' }} showsVerticalScrollIndicator={false}>
      <View style={{ paddingTop: 24, paddingBottom: 16, paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#333F48', marginBottom: 4 }}>Mis Documentos</Text>
        <Text style={{ color: '#A08C79' }}>Documentación de identidad</Text>
      </View>

      <View style={{ padding: 16 }}>
        <View style={{ backgroundColor: 'white', borderRadius: 12, borderWidth: 1, borderColor: '#e5e7eb', padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <FileText color="#6A4F99" size={24} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontWeight: 'bold', color: '#333F48' }}>Documento de Identidad</Text>
              {verificado ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <CheckCircle color="#16a34a" size={12} />
                  <Text style={{ fontSize: 12, color: '#16a34a', fontWeight: '500', marginLeft: 4 }}>Verificado</Text>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                  <Clock color="#C9A063" size={12} />
                  <Text style={{ fontSize: 12, color: '#C9A063', fontWeight: '500', marginLeft: 4 }}>Pendiente de verificación</Text>
                </View>
              )}
            </View>
          </View>

          <Text style={{ fontSize: 14, color: '#A08C79', lineHeight: 20 }}>
            {verificado
              ? 'Tu identidad ha sido verificada. Podés participar en subastas disponibles para tu categoría.'
              : 'Tu cuenta está pendiente de verificación por nuestro equipo. Este proceso puede demorar hasta 72 horas hábiles.'}
          </Text>

          {!verificado && (
            <TouchableOpacity
              onPress={() => Alert.alert('Soporte', 'Para consultas sobre tu verificación, contactá a subastas.hammer@gmail.com')}
              style={{ marginTop: 16, backgroundColor: '#6A4F99', height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>Contactar Soporte</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
    </View>
  );
}
