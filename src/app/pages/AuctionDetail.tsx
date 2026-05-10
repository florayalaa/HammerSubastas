import { Link, useParams } from "react-router";
import { Calendar, MapPin, Users, Package, ChevronLeft, Play, Lock } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../context/AuthContext";

export function AuctionDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  // Mock auction data
  const auction = {
    id: Number(id),
    title: "Subasta de Arte Contemporáneo",
    date: "18 de Marzo, 2026",
    time: "18:00",
    location: "Buenos Aires, Argentina",
    category: "Oro",
    currency: "USD",
    auctioneer: "Ricardo Martínez",
    description: "Una exclusiva colección de arte contemporáneo que incluye obras de reconocidos artistas internacionales. Esta subasta presenta piezas únicas que han sido cuidadosamente seleccionadas para coleccionistas exigentes.",
    status: "upcoming",
  };

  const catalogItems = [
    {
      id: 1,
      itemNumber: "001",
      title: "Anillo de Diamantes Art Déco",
      description: "Exquisito anillo de platino con diamante central de 3.5 quilates, rodeado de diamantes más pequeños. Circa 1925.",
      artist: "Cartier",
      currentOwner: "María González",
      startingBid: "$45,000",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3NzM2MzgxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      history: "Perteneciente a la colección privada de la familia Windsor desde 1930.",
    },
    {
      id: 2,
      itemNumber: "002",
      title: "Set de Copas de Cristal Bohemio",
      description: "Juego completo de 12 copas de cristal tallado a mano. Incluye 6 copas de vino tinto, 6 copas de vino blanco. Estado impecable, sin roturas ni rayones.",
      currentOwner: "Roberto Silva",
      startingBid: "$3,200",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1695901741829-7a9cc23d32ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmFzZSUyMGNlcmFtaWN8ZW58MXx8fHwxNzczNzA3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
    },
    {
      id: 3,
      itemNumber: "003",
      title: "Escultura de Bronce Moderna",
      description: "Escultura abstracta de bronce patinado. Altura: 85cm. Firmada y numerada 12/25.",
      artist: "Pablo Serrano",
      year: "1968",
      currentOwner: "Carlos Rodríguez",
      startingBid: "$28,000",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1736593494014-bb6091ef356a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc2N1bHB0dXJlJTIwYnJvbnplfGVufDF8fHx8MTc3MzcwNzYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      history: "Exhibida en el Museo de Arte Moderno de Madrid entre 1970-1975.",
    },
    {
      id: 4,
      itemNumber: "004",
      title: "Reloj de Bolsillo Antiguo",
      description: "Reloj de bolsillo en oro de 18k con cadena original. Mecanismo de cuerda manual en perfecto funcionamiento. Diámetro: 5cm. Peso: 85g.",
      currentOwner: "Fernando Méndez",
      startingBid: "$8,500",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwd2F0Y2glMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MzcwNzUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
    },
    {
      id: 5,
      itemNumber: "005",
      title: "Jarrón de Porcelana China",
      description: "Jarrón de porcelana con decoración de dragón y fénix. Dinastía Qing, periodo Kangxi (1662-1722). Altura: 42cm.",
      artist: "Artesano desconocido",
      year: "1700",
      currentOwner: "Alejandra Pérez",
      startingBid: "$65,000",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1695901741829-7a9cc23d32ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmFzZSUyMGNlcmFtaWN8ZW58MXx8fHwxNzczNzA3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
      history: "Procedente de una colección privada europea. Certificado de autenticidad incluido.",
    },
    {
      id: 6,
      itemNumber: "006",
      title: "Colección de Monedas Romanas",
      description: "Lote de 15 monedas del Imperio Romano. Periodo: 100-300 d.C. Incluye denarios de plata y algunos bronces. Certificado de autenticidad. Estado de conservación variable.",
      currentOwner: "Patricia Morales",
      startingBid: "$12,000",
      currentBid: null,
      images: [
        "https://images.unsplash.com/photo-1695901741829-7a9cc23d32ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmFzZSUyMGNlcmFtaWN8ZW58MXx8fHwxNzczNzA3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6A4F99] to-[#C9A063] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 mb-4 text-white/80 hover:text-white transition-colors"
          >
            <ChevronLeft size={20} />
            Volver a Subastas
          </Link>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {auction.category}
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                  {auction.currency}
                </span>
              </div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-3">{auction.title}</h1>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>{auction.date} • {auction.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} />
                  <span>{auction.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users size={18} />
                  <span>Rematador: {auction.auctioneer}</span>
                </div>
              </div>
            </div>
            
            {auction.status === "live" && (
              <Link
                to={`/auctions/${auction.id}/live`}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <Play size={20} />
                Unirse a la Subasta EN VIVO
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 py-8 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#333F48] mb-4">Descripción</h2>
          <p className="text-[#A08C79] leading-relaxed">{auction.description}</p>
        </div>
      </div>

      {/* Catalog */}
      <div className="px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#333F48]">Catálogo de Artículos</h2>
            <div className="flex items-center gap-2 text-[#A08C79]">
              <Package size={18} />
              <span>{catalogItems.length} artículos</span>
            </div>
          </div>

          <div className="space-y-6">
            {catalogItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 aspect-square md:aspect-auto">
                    <ImageWithFallback
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-[#333F48] mb-2">
                          {item.title}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#A08C79] mb-1">Precio Base</div>
                        {isAuthenticated ? (
                          <div className="text-2xl font-bold text-[#C9A063]">
                            {item.startingBid}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#A08C79]">
                            <Lock size={18} />
                            <Link to="/login" className="text-primary hover:underline text-sm">
                              Inicia sesión
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-[#A08C79] mb-4">{item.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {item.artist && (
                        <div>
                          <div className="text-sm text-[#A08C79] mb-1">Artista/Diseñador</div>
                          <div className="font-semibold text-[#333F48]">{item.artist}</div>
                        </div>
                      )}
                      {item.year && (
                        <div>
                          <div className="text-sm text-[#A08C79] mb-1">Año</div>
                          <div className="font-semibold text-[#333F48]">{item.year}</div>
                        </div>
                      )}
                      {item.currentOwner && (
                        <div>
                          <div className="text-sm text-[#A08C79] mb-1">Dueño Actual</div>
                          <div className="font-semibold text-[#333F48]">{item.currentOwner}</div>
                        </div>
                      )}
                    </div>

                    {item.history && (
                      <div className="bg-[#C9A063]/20 border border-[#C9A063] rounded-lg p-4">
                        <div className="text-sm text-[#A08C79] mb-1">Historia</div>
                        <p className="text-sm text-[#333F48]">{item.history}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}