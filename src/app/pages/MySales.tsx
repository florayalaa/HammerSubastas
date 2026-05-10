import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ChevronLeft, Package, Shield, Phone, FileText, MapPin, ChevronDown, ChevronUp, Search, Check, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type SaleStatus = "Vendido" | "En Subasta" | "A Subastar" | "Rechazado" | "Pendiente";

interface Sale {
  id: number;
  itemNumber: string;
  title: string;
  description: string;
  soldPrice?: number;
  soldDate?: string;
  currentBid?: number;
  basePrice?: number;
  commission?: number;
  auctionName: string;
  status: SaleStatus;
  image: string;
  insurance?: {
    name: string;
    policyNumber: string;
    contact: string;
  };
  location?: string;
  auctionLocation?: string;
  rejectionReason?: string;
  hasOffer?: boolean;
  scheduledAuctionDate?: string;
}

export function MySales() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<SaleStatus | "Todos">("Todos");
  const navigate = useNavigate();

  const [mySoldItems, setMySoldItems] = useState<Sale[]>([
    {
      id: 6,
      itemNumber: "V-006",
      title: "Escultura de Mármol Contemporánea",
      description: "Escultura moderna de mármol blanco, altura 120cm. Firmada por el artista.",
      auctionName: "",
      status: "Pendiente",
      basePrice: 18000,
      commission: 1800,
      hasOffer: true,
      image: "https://images.unsplash.com/photo-1736593494014-bb6091ef356a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc2N1bHB0dXJlJTIwYnJvbnplfGVufDF8fHx8MTc3MzcwNzYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 7,
      itemNumber: "V-007",
      title: "Juego de Té de Plata",
      description: "Juego completo de té en plata de ley 925, circa 1920. Incluye tetera, azucarera y cremera.",
      auctionName: "",
      status: "Pendiente",
      image: "https://images.unsplash.com/photo-1695901741829-7a9cc23d32ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmFzZSUyMGNlcmFtaWN8ZW58MXx8fHwxNzczNzA3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 1,
      itemNumber: "V-001",
      title: "Anillo de Esmeraldas Vintage",
      description: "Anillo de oro blanco 18k con esmeralda central de 2.8 quilates.",
      soldPrice: 32000,
      commission: 3200,
      soldDate: "15 de Marzo, 2026",
      auctionName: "Subasta de Joyería Fina",
      status: "Vendido",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyYWxkJTIwcmluZ3xlbnwxfHx8fDE3NzM3MDc2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 5,
      itemNumber: "V-005",
      title: "Lámpara de Mesa Decorativa",
      description: "",
      auctionName: "",
      status: "Rechazado",
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWJsZSUyMGxhbXB8ZW58MXx8fHwxNzM4NjE1MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      rejectionReason: "Las fotografías proporcionadas no cumplen con nuestros estándares de calidad. Se requieren imágenes en alta resolución con buena iluminación desde múltiples ángulos. Además, la descripción del artículo está incompleta - falta información sobre el material, dimensiones, estado de conservación y procedencia. Por favor, actualiza las fotos y completa toda la información requerida para volver a enviar el artículo.",
    },
    {
      id: 2,
      itemNumber: "V-002",
      title: "Reloj de Bolsillo Antiguo",
      description: "Reloj de bolsillo de oro de 14k, circa 1890. Mecanismo suizo en perfectas condiciones.",
      currentBid: 8500,
      commission: 850,
      auctionName: "Colección de Relojes Históricos",
      status: "En Subasta",
      image: "https://images.unsplash.com/photo-1509941943102-10c232535736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwb2NrZXQlMjB3YXRjaCUyMGFudGlxdWV8ZW58MXx8fHwxNzczNzA3NjA2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      insurance: {
        name: "Seguros Premium S.A.",
        policyNumber: "POL-2026-0001234",
        contact: "+54 11 4567-8900",
      },
      auctionLocation: "Sala de Subastas - Hotel Alvear, Buenos Aires",
    },
    {
      id: 3,
      itemNumber: "V-003",
      title: "Pintura al Óleo del Siglo XIX",
      description: "Paisaje europeo firmado por artista reconocido.",
      basePrice: 25000,
      commission: 2500,
      auctionName: "Próxima Subasta de Arte",
      status: "A Subastar",
      scheduledAuctionDate: "3 de Mayo, 2026",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvaWwlMjBwYWludGluZ3xlbnwxfHx8fDE3NzM3MDc2MDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      insurance: {
        name: "ART Seguros",
        policyNumber: "POL-2026-0001180",
        contact: "+54 11 5555-1234",
      },
      location: "Depósito Central - Buenos Aires",
    },
    {
      id: 4,
      itemNumber: "V-004",
      title: "Collar de Perlas Naturales",
      description: "Collar de perlas naturales de agua salada con broche de oro blanco.",
      basePrice: 12000,
      commission: 1200,
      auctionName: "Esperando Próxima Subasta",
      status: "A Subastar",
      scheduledAuctionDate: "1 de Mayo, 2026",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZWFybCUyMG5lY2tsYWNlfGVufDF8fHx8MTc3MzcwNzYwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      insurance: {
        name: "Seguros Premium S.A.",
        policyNumber: "POL-2026-0001456",
        contact: "+54 11 4567-8900",
      },
      location: "Depósito Sur - Montevideo",
    },
  ]);

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const handleAcceptOffer = (item: Sale) => {
    if (window.confirm(
      `¿Estás seguro de que deseas ACEPTAR la oferta?\n\n` +
      `Precio Base: $${item.basePrice?.toLocaleString()}\n` +
      `Comisión: $${item.commission?.toLocaleString()}\n\n` +
      `Esta decisión es irreversible y no podrás cambiarla posteriormente.`
    )) {
      // Calcular fecha de subasta (dentro de 7 días como ejemplo)
      const auctionDate = new Date();
      auctionDate.setDate(auctionDate.getDate() + 7);
      const formattedDate = auctionDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

      // Actualizar el item a "A Subastar"
      setMySoldItems(items =>
        items.map(i =>
          i.id === item.id
            ? {
                ...i,
                status: "A Subastar" as SaleStatus,
                hasOffer: false,
                auctionName: "Próxima Subasta Programada",
                scheduledAuctionDate: formattedDate
              }
            : i
        )
      );
      alert(`✓ Oferta aceptada con éxito. Tu artículo será subastado el ${formattedDate}.`);
    }
  };

  const handleRejectOffer = (item: Sale) => {
    if (window.confirm(
      `¿Estás seguro de que deseas RECHAZAR la oferta?\n\n` +
      `Precio Base Ofrecido: $${item.basePrice?.toLocaleString()}\n` +
      `Comisión: $${item.commission?.toLocaleString()}\n\n` +
      `Esta decisión es irreversible. Tu artículo NO será subastado y deberás retirarlo.`
    )) {
      // Actualizar el item a "Rechazado"
      setMySoldItems(items =>
        items.map(i =>
          i.id === item.id
            ? {
                ...i,
                status: "Rechazado" as SaleStatus,
                hasOffer: false,
                rejectionReason: "Oferta rechazada por el vendedor. El artículo no será incluido en subasta."
              }
            : i
        )
      );
      alert("✓ Oferta rechazada. Tu artículo no será incluido en la subasta.");
    }
  };

  const filteredItems = mySoldItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.itemNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "Todos" || item.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  // Ordenar: items pendientes con oferta primero
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (a.status === "Pendiente" && a.hasOffer && !(b.status === "Pendiente" && b.hasOffer)) return -1;
    if (!(a.status === "Pendiente" && a.hasOffer) && b.status === "Pendiente" && b.hasOffer) return 1;
    return 0;
  });

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 mb-4 text-[#A08C79] hover:text-[#333F48] transition-colors"
          >
            <ChevronLeft size={20} />
            Volver al Perfil
          </Link>
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Mis Ventas</h1>
          <p className="text-[#A08C79]">Artículos que has puesto en subasta</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A08C79]" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, descripción o número..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter by Status */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as SaleStatus | "Todos")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Vendido">Vendido</option>
                <option value="En Subasta">En Subasta</option>
                <option value="A Subastar">A Subastar</option>
                <option value="Rechazado">Rechazado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sales List */}
        <div className="space-y-6">
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg shadow-md border overflow-hidden ${
                item.status === "Pendiente" && item.hasOffer
                  ? "border-[#C9A063] border-2 ring-2 ring-[#C9A063]/20"
                  : "border-gray-200"
              }`}
            >
              {item.status === "Pendiente" && item.hasOffer ? (
                // Layout especial para items pendientes con oferta
                <div>
                  {/* Banner de alerta */}
                  <div className="bg-gradient-to-r from-[#C9A063] to-[#A08C79] text-white px-6 py-3">
                    <p className="font-bold text-center">⚡ OFERTA RECIBIDA - REQUIERE TU RESPUESTA</p>
                  </div>

                  <div className="md:flex">
                    {/* Image */}
                    <div className="md:w-1/4 aspect-square md:aspect-auto">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="md:w-3/4 p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-[#A08C79]">#{item.itemNumber}</span>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 animate-pulse">
                          Pendiente - Oferta Recibida
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#333F48] mb-2">
                        {item.title}
                      </h2>
                      <p className="text-[#A08C79] mb-4">{item.description}</p>

                      {/* Oferta Details */}
                      <div className="bg-[#C9A063]/10 border border-[#C9A063] rounded-lg p-6 mb-6">
                        <h3 className="font-bold text-[#333F48] mb-4 text-lg">Detalles de la Oferta</h3>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div className="text-sm text-[#A08C79] mb-1">Precio Base Asignado</div>
                            <div className="text-2xl font-bold text-[#333F48]">
                              ${item.basePrice?.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-[#A08C79] mb-1">Comisión (10%)</div>
                            <div className="text-2xl font-bold text-[#333F48]">
                              ${item.commission?.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                          <p className="text-sm text-blue-800">
                            <strong>Nota:</strong> El precio base es el valor inicial desde donde comenzará la puja en la subasta.
                            La comisión se aplicará sobre el precio final de venta.
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={() => handleAcceptOffer(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                        >
                          <Check size={20} />
                          Aceptar Oferta
                        </button>
                        <button
                          onClick={() => handleRejectOffer(item)}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                        >
                          <X size={20} />
                          Rechazar Oferta
                        </button>
                      </div>

                      <p className="text-xs text-center text-[#A08C79] mt-4">
                        ⚠️ Ambas decisiones son irreversibles. Por favor, revisa cuidadosamente antes de continuar.
                      </p>
                    </div>
                  </div>
                </div>
              ) : item.status === "Pendiente" && !item.hasOffer ? (
                // Layout para items pendientes sin oferta
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/4 aspect-square md:aspect-auto">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-[#A08C79]">#{item.itemNumber}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
                        Pendiente
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333F48] mb-2">
                      {item.title}
                    </h2>
                    <p className="text-[#A08C79] mb-4">{item.description}</p>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Tu artículo está siendo evaluado por nuestro equipo de expertos.
                        Recibirás una notificación cuando se te asigne un precio base y comisión.
                      </p>
                    </div>
                  </div>
                </div>
              ) : item.status === "Rechazado" ? (
                // Layout simplificado para items rechazados
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/4 aspect-square md:aspect-auto">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-[#A08C79]">#{item.itemNumber}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        Rechazado
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-[#333F48] mb-4">
                      {item.title}
                    </h2>

                    {/* Desplegable de causa de rechazo */}
                    <div>
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-semibold mb-2"
                      >
                        {expandedItems.has(item.id) ? (
                          <>
                            <ChevronUp size={20} />
                            Ocultar causa de rechazo
                          </>
                        ) : (
                          <>
                            <ChevronDown size={20} />
                            Ver causa de rechazo
                          </>
                        )}
                      </button>

                      {expandedItems.has(item.id) && item.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <h3 className="font-bold text-red-900 mb-2">Motivo del Rechazo</h3>
                          <p className="text-sm text-red-800 leading-relaxed">
                            {item.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Layout normal para otros estados
                <div className="md:flex">
                  {/* Image */}
                  <div className="md:w-1/4 aspect-square md:aspect-auto">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                      <div className="mb-4 md:mb-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-[#A08C79]">#{item.itemNumber}</span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.status === "Vendido"
                                ? "bg-green-100 text-green-700"
                                : item.status === "En Subasta"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <h2 className="text-2xl font-bold text-[#333F48] mb-2">
                          {item.title}
                        </h2>
                        <p className="text-[#A08C79] mb-3">{item.description}</p>
                        <div className="text-sm text-[#A08C79] mb-3">
                          {item.status === "Vendido" ? "Subastado en: " : "Subasta: "}
                          <span className="font-semibold">{item.auctionName}</span>
                        </div>

                        {/* Mostrar fecha programada para items A Subastar */}
                        {item.status === "A Subastar" && item.scheduledAuctionDate && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="text-xs text-blue-800 mb-1">Fecha de Subasta Programada</div>
                            <div className="text-sm font-bold text-blue-900">{item.scheduledAuctionDate}</div>
                            <div className="text-xs text-blue-700 mt-1">
                              Tu artículo será subastado en esta fecha
                            </div>
                          </div>
                        )}

                        {/* Mostrar comisión */}
                        {item.commission && (
                          <div className="text-sm text-[#A08C79]">
                            Comisión: <span className="font-semibold text-[#333F48]">${item.commission.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        {item.soldPrice && (
                          <>
                            <div className="text-sm text-[#A08C79] mb-1">Precio de Venta</div>
                            <div className="text-3xl font-bold text-[#C9A063]">
                              ${item.soldPrice.toLocaleString()}
                            </div>
                            {item.soldDate && (
                              <div className="text-sm text-[#A08C79] mt-1">{item.soldDate}</div>
                            )}
                          </>
                        )}
                        {item.currentBid && item.status === "En Subasta" && (
                          <>
                            <div className="text-sm text-[#A08C79] mb-1">Oferta Actual</div>
                            <div className="text-3xl font-bold text-[#C9A063]">
                              ${item.currentBid.toLocaleString()}
                            </div>
                          </>
                        )}
                        {item.basePrice && item.status === "A Subastar" && (
                          <>
                            <div className="text-sm text-[#A08C79] mb-1">Precio Base</div>
                            <div className="text-3xl font-bold text-[#C9A063]">
                              ${item.basePrice.toLocaleString()}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Expandable Insurance and Location */}
                    {item.status !== "Vendido" && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold mb-4"
                        >
                          {expandedItems.has(item.id) ? (
                            <>
                              <ChevronUp size={20} />
                              Ocultar detalles de seguro y ubicación
                            </>
                          ) : (
                            <>
                              <ChevronDown size={20} />
                              Ver detalles de seguro y ubicación
                            </>
                          )}
                        </button>

                        {expandedItems.has(item.id) && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Insurance Details */}
                            {item.insurance && (
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <Shield className="text-blue-600" size={20} />
                                  <h3 className="font-bold text-[#333F48]">Seguro</h3>
                                </div>
                                <div className="space-y-2">
                                  <div>
                                    <div className="text-xs text-[#A08C79] mb-1">Aseguradora</div>
                                    <div className="font-semibold text-[#333F48] text-sm">
                                      {item.insurance.name}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-[#A08C79] mb-1">Número de Póliza</div>
                                    <div className="font-semibold text-[#333F48] text-sm flex items-center gap-2">
                                      <FileText size={14} />
                                      {item.insurance.policyNumber}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-xs text-[#A08C79] mb-1">Contacto</div>
                                    <div className="font-semibold text-[#333F48] text-sm flex items-center gap-2">
                                      <Phone size={14} />
                                      {item.insurance.contact}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Location */}
                            <div className="bg-[#C9A063]/10 border border-[#C9A063] rounded-lg p-4">
                              <div className="flex items-center gap-2 mb-3">
                                <MapPin className="text-[#C9A063]" size={20} />
                                <h3 className="font-bold text-[#333F48]">Ubicación Actual</h3>
                              </div>
                              <div className="flex items-start gap-2">
                                <Package className="text-[#A08C79] mt-1" size={18} />
                                <div>
                                  <div className="font-semibold text-[#333F48]">
                                    {item.status === "En Subasta"
                                      ? item.auctionLocation
                                      : item.location}
                                  </div>
                                  <p className="text-sm text-[#A08C79] mt-1">
                                    {item.status === "En Subasta"
                                      ? "Tu artículo está actualmente en la sala de subastas."
                                      : "Tu artículo está asegurado y protegido en nuestro depósito."}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {sortedItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <Package className="mx-auto mb-4 text-[#A08C79]" size={48} />
            <p className="text-[#A08C79] text-lg mb-4">
              {searchQuery || filterStatus !== "Todos"
                ? "No se encontraron artículos con los filtros aplicados"
                : "Aún no has puesto ningún artículo en subasta"}
            </p>
            {!searchQuery && filterStatus === "Todos" && (
              <Link
                to="/sell-item"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subastar un Artículo
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
