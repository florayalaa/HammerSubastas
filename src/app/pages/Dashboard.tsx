import { Link } from "react-router";
import { TrendingUp, Gavel, Award, DollarSign, Clock, ChevronRight, Bell } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useNotifications } from "../context/NotificationContext";
import { 
  createDocumentNotification, 
  createProductNotification, 
  createPaymentMethodNotification,
  createAuctionLiveNotification 
} from "../utils/notificationHelpers";

export function Dashboard() {
  const { addNotification } = useNotifications();

  // Función de demostración para crear notificaciones de prueba
  const createTestNotifications = () => {
    // Documento aprobado
    addNotification(createDocumentNotification(true, "DNI Frente y Dorso"));
    
    // Producto aprobado
    setTimeout(() => {
      addNotification(createProductNotification(true, "Reloj Rolex Submariner", undefined, "1"));
    }, 500);
    
    // Medio de pago aprobado
    setTimeout(() => {
      addNotification(createPaymentMethodNotification(true, "Tarjeta Visa ****1234"));
    }, 1000);
    
    // Subasta en vivo
    setTimeout(() => {
      addNotification(createAuctionLiveNotification("Subasta de Arte Contemporáneo", "1"));
    }, 1500);
    
    // Documento rechazado (ejemplo)
    setTimeout(() => {
      addNotification(createDocumentNotification(false, "Comprobante de Domicilio", "La imagen no es legible."));
    }, 2000);
  };

  const stats = [
    {
      label: "Subastas Activas",
      value: "12",
      color: "bg-[#6A4F99]",
    },
    {
      label: "Participaciones",
      value: "45",
      color: "bg-[#C9A063]",
    },
    {
      label: "Total Gastado",
      value: "$125,400",
      color: "bg-[#A08C79]",
    },
  ];

  const activeAuctions = [
    {
      id: 1,
      title: "Subasta de Arte Contemporáneo",
      date: "18 de Marzo, 2026 - 18:00",
      dateObj: new Date("2026-03-18T18:00:00"),
      category: "Oro",
      items: 24,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhdWN0aW9uJTIwYXJ0JTIwZ2FsbGVyeXxlbnwxfHx8fDE3NzM3MDc1MjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 2,
      title: "Colección de Relojes de Lujo",
      date: "19 de Marzo, 2026 - 20:00",
      dateObj: new Date("2026-03-19T20:00:00"),
      category: "Platino",
      items: 18,
      status: "live",
      image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwd2F0Y2glMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MzcwNzUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    {
      id: 3,
      title: "Joyería Vintage Exclusiva",
      date: "20 de Marzo, 2026 - 19:00",
      dateObj: new Date("2026-03-20T19:00:00"),
      category: "Plata",
      items: 32,
      status: "upcoming",
      image: "https://images.unsplash.com/photo-1721103428182-89ba395d44bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwamV3ZWxyeSUyMGRpYW1vbmRzfGVufDF8fHx8MTc3MzcwNzUyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
  ].sort((a, b) => {
    // Primero: priorizar subastas en vivo
    if (a.status === "live" && b.status !== "live") return -1;
    if (a.status !== "live" && b.status === "live") return 1;

    // Segundo: ordenar por fecha (más próxima primero)
    return a.dateObj.getTime() - b.dateObj.getTime();
  });

  const recentBids = [
    {
      item: "Reloj Patek Philippe 1942",
      auction: "Colección de Relojes",
      bid: "$45,000",
      status: "leading",
      time: "Hace 15 min",
    },
    {
      item: "Collar de Esmeraldas Art Déco",
      auction: "Joyería Vintage",
      bid: "$28,500",
      status: "outbid",
      time: "Hace 1 hora",
    },
    {
      item: "Pintura Abstracta Moderna",
      auction: "Arte Contemporáneo",
      bid: "$15,200",
      status: "leading",
      time: "Hace 3 horas",
    },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Dashboard</h1>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-[#C9A063] text-white rounded-full text-sm">
              Categoría: Oro
            </div>
          </div>
        </div>

        {/* Stats Grid - Subastas Activas y Participaciones al mismo nivel */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8">
          {stats.slice(0, 2).map((stat, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Gavel className="text-white" size={24} />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#333F48] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[#A08C79]">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Total Gastado */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stats[2].color} rounded-lg flex items-center justify-center`}>
                <DollarSign className="text-white" size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-[#333F48] mb-1">
              {stats[2].value}
            </div>
            <div className="text-sm text-[#A08C79]">{stats[2].label}</div>
          </div>
        </div>

        {/* Active Auctions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#333F48]">Subastas Activas</h2>
            <Link
              to="/auctions"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Ver todas
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeAuctions.map((auction) => (
              <Link
                key={auction.id}
                to={`/auctions/${auction.id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <ImageWithFallback
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {auction.status === "live" && (
                      <div className="px-2 py-1 bg-red-500 text-white rounded text-xs flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                        EN VIVO
                      </div>
                    )}
                    <div className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {auction.category}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#A08C79]">
                      <Clock size={14} />
                      {auction.items} artículos
                    </div>
                  </div>
                  <h3 className="font-semibold text-[#333F48] mb-2">
                    {auction.title}
                  </h3>
                  <p className="text-sm text-[#A08C79]">{auction.date}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Bids */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#333F48]">Pujas Recientes</h2>
            <Link
              to="/my-bids"
              className="text-primary hover:underline flex items-center gap-1"
            >
              Ver historial
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                      Artículo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                      Subasta
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                      Puja
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-[#A08C79] uppercase tracking-wider">
                      Tiempo
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentBids.map((bid, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#333F48]">
                        {bid.item}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A08C79]">
                        {bid.auction}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#333F48]">
                        {bid.bid}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {bid.status === "leading" ? (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                            Ganando
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                            Superado
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#A08C79]">
                        {bid.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}