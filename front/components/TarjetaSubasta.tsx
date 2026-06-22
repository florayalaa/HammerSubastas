import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Link } from 'expo-router';
import { Calendar, Users, DollarSign, Lock } from 'lucide-react-native';
import { Card } from '@/components/ui/Card';

const IMAGEN_PLACEHOLDER = { uri: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?auto=format&fit=crop&w=800&q=80" };

interface TarjetaSubastaProps {
  subasta: {
    id: string | number;
    titulo: string;
    fecha: string;
    hora: string;
    categoria: string;
    moneda: string;
    articulos: number;
    pujaInicial: string;
    estado: 'en_vivo' | 'proxima' | string;
    imagen?: string | null;
  };
  estaAutenticado: boolean;
}

export const TarjetaSubasta = ({ subasta, estaAutenticado }: TarjetaSubastaProps) => {
  const [imgError, setImgError] = useState(false);

  const fuenteImagen =
    !imgError && subasta.imagen
      ? { uri: subasta.imagen }
      : IMAGEN_PLACEHOLDER;

  return (
    <Card className="overflow-hidden border-gray-200 bg-white rounded-xl mb-6 shadow-sm">
      {/* Contenedor de Imagen */}
      <View className="w-full h-48 bg-gray-100 justify-center items-center">
        <Image
          source={fuenteImagen}
          resizeMode="cover"
          style={{ width: '100%', height: '100%' }}
          onError={() => setImgError(true)}
        />
      </View>

      {/* Cuerpo de la Tarjeta */}
      <View className="p-5">
        {/* Etiquetas / Badges */}
        <View className="flex-row items-center gap-2 mb-3 flex-wrap">
          {subasta.estado === "en_vivo" && (
            <View className="px-2 py-1 bg-[#EE3B3B] rounded-full flex-row items-center gap-1">
              <View className="w-1.5 h-1.5 bg-white rounded-full" />
              <Text className="text-white text-[10px] font-bold">● EN VIVO</Text>
            </View>
          )}
          <View className="px-2 py-1 bg-[#6A4F99]/10 rounded-full">
            <Text className="text-[#6A4F99] text-[10px] font-medium">{subasta.categoria}</Text>
          </View>
          <View className="px-2 py-1 bg-[#C9A063]/10 rounded-full">
            <Text className="text-[#C9A063] text-[10px] font-medium">{subasta.moneda}</Text>
          </View>
        </View>

        {/* Título */}
        <Text className="text-xl font-bold text-[#333F48] mb-3">{subasta.titulo}</Text>

        {/* Detalles con Iconos */}
        <View className="space-y-2 mb-4">
          <View className="flex-row items-center gap-2 mb-1">
            <Calendar size={16} color="#A08C79" />
            <Text className="text-sm text-[#A08C79]">{subasta.fecha} • {subasta.hora}</Text>
          </View>
          
          <View className="flex-row items-center gap-2 mb-1">
            <Users size={16} color="#A08C79" />
            <Text className="text-sm text-[#A08C79]">{subasta.articulos} artículos</Text>
          </View>

          <View className="flex-row items-center gap-2">
            <DollarSign size={16} color="#A08C79" />
            {estaAutenticado ? (
              <Text className="text-sm text-[#A08C79]">Desde {subasta.pujaInicial}</Text>
            ) : (
              <View className="flex-row items-center">
                <Lock size={14} color="#A08C79" className="mr-1" />
                <Link href="/(autenticacion)/iniciar-sesion" asChild>
                  <TouchableOpacity>
                    <Text className="text-[#6A4F99] text-sm underline">Inicia sesión</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            )}
          </View>
        </View>

        {/* Botones de Acción */}
        <View className="flex-row gap-3 mt-2">
          <Link href={`/subastas/${subasta.id}`} asChild>
            <TouchableOpacity className="flex-1 bg-[#6A4F99] py-3 rounded-lg items-center justify-center">
              <Text className="text-white font-semibold text-sm">Ver Catálogo</Text>
            </TouchableOpacity>
          </Link>
          
          {subasta.estado === "en_vivo" && (
            <Link href={`/subastas/en-vivo/${subasta.id}`} asChild>
              <TouchableOpacity className="flex-1 bg-[#EE3B3B] py-3 rounded-lg flex-row justify-center items-center gap-2">
                <Text className="text-white font-semibold text-sm">Participar</Text>
              </TouchableOpacity>
            </Link>
          )}
        </View>
      </View>
    </Card>
  );
};