import { useState } from "react";
import { Link } from "react-router";
import { ChevronLeft, ShoppingBag, ChevronDown, ChevronUp, Search, FileText, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type PurchaseStatus = "Pendiente de Pago" | "Recibido" | "A Enviar";

interface Purchase {
  id: number;
  invoiceNumber: string;
  title: string;
  finalBid: number;
  commission: number;
  shipping: number;
  taxes: number;
  total: number;
  status: PurchaseStatus;
  image: string;
  auctionName: string;
  purchaseDate: string;
  paymentDeadline?: string;
}

export function MyPurchases() {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<PurchaseStatus | "Todos">("Todos");
  const [showPaymentWarning, setShowPaymentWarning] = useState(true);

  const myPurchases: Purchase[] = [
    {
      id: 0,
      invoiceNumber: "FAC-2026-001289",
      title: "Pintura al Óleo Paisaje Europeo",
      finalBid: 22000,
      commission: 2200,
      shipping: 950,
      taxes: 2516,
      total: 27666,
      status: "Pendiente de Pago",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
      auctionName: "Subasta de Arte Contemporáneo",
      purchaseDate: "18 de Abril, 2026",
      paymentDeadline: "21 de Abril, 2026",
    },
    {
      id: 1,
      invoiceNumber: "FAC-2026-001234",
      title: "Anillo de Diamantes Art Déco",
      finalBid: 45000,
      commission: 4500,
      shipping: 850,
      taxes: 5035,
      total: 55385,
      status: "Recibido",
      image: "https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3NzM2MzgxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      auctionName: "Subasta de Arte Contemporáneo",
      purchaseDate: "15 de Marzo, 2026",
    },
    {
      id: 2,
      invoiceNumber: "FAC-2026-001189",
      title: "Escultura de Bronce Moderna",
      finalBid: 28000,
      commission: 2800,
      shipping: 1200,
      taxes: 3200,
      total: 35200,
      status: "A Enviar",
      image: "https://images.unsplash.com/photo-1736593494014-bb6091ef356a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwc2N1bHB0dXJlJTIwYnJvbnplfGVufDF8fHx8MTc3MzcwNzYwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      auctionName: "Colección de Arte Moderno",
      purchaseDate: "20 de Marzo, 2026",
    },
    {
      id: 3,
      invoiceNumber: "FAC-2026-001145",
      title: "Reloj de Bolsillo Antiguo",
      finalBid: 8500,
      commission: 850,
      shipping: 350,
      taxes: 969,
      total: 10669,
      status: "Recibido",
      image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwd2F0Y2glMjBjb2xsZWN0aW9ufGVufDF8fHx8MTc3MzcwNzUyMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      auctionName: "Colección de Relojes Históricos",
      purchaseDate: "10 de Marzo, 2026",
    },
    {
      id: 4,
      invoiceNumber: "FAC-2026-001256",
      title: "Set de Copas de Cristal Bohemio",
      finalBid: 3200,
      commission: 320,
      shipping: 450,
      taxes: 397,
      total: 4367,
      status: "A Enviar",
      image: "https://images.unsplash.com/photo-1695901741829-7a9cc23d32ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpcXVlJTIwdmFzZSUyMGNlcmFtaWN8ZW58MXx8fHwxNzczNzA3NjA1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      auctionName: "Subasta de Cristalería Fina",
      purchaseDate: "25 de Marzo, 2026",
    },
  ];

  const toggleExpanded = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredItems = myPurchases.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.auctionName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = filterStatus === "Todos" || item.status === filterStatus;

    return matchesSearch && matchesFilter;
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
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Mis Compras</h1>
          <p className="text-[#A08C79]">Artículos que has ganado en subastas</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A08C79]" size={20} />
              <input
                type="text"
                placeholder="Buscar por título, factura o subasta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Filter by Status */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as PurchaseStatus | "Todos")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Pendiente de Pago">Pendiente de Pago</option>
                <option value="Recibido">Recibido</option>
                <option value="A Enviar">A Enviar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment Warning */}
        {myPurchases.some(p => p.status === "Pendiente de Pago") && (
          <div className="mb-6">
            <div className="bg-red-50 border border-red-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setShowPaymentWarning(!showPaymentWarning)}
                className="w-full flex items-center justify-between p-4 hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="text-red-600" size={24} />
                  <span className="font-semibold text-red-900">
                    Tienes pagos pendientes
                  </span>
                </div>
                {showPaymentWarning ? (
                  <ChevronUp size={20} className="text-red-600" />
                ) : (
                  <ChevronDown size={20} className="text-red-600" />
                )}
              </button>

              {showPaymentWarning && (
                <div className="px-4 pb-4 pt-2">
                  <div className="bg-white border border-red-200 rounded-lg p-4">
                    <h3 className="font-bold text-red-900 mb-3">Aviso Importante sobre Pagos</h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-red-800">
                      <li>
                        Debes completar el pago dentro de las <strong>72 horas</strong> posteriores a ganar la subasta
                      </li>
                      <li>
                        El incumplimiento del plazo de pago puede resultar en una <strong>multa del 10%</strong> del valor total de la compra
                      </li>
                      <li>
                        Si no se realiza el pago dentro de los 7 días, tu cuenta puede ser <strong>suspendida temporalmente</strong>
                      </li>
                      <li>
                        Los reincidentes pueden recibir <strong>suspensión permanente</strong> de la plataforma
                      </li>
                      <li>
                        Puedes proceder al pago haciendo clic en el botón "Proceder al Pago" en cada artículo
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Purchases List */}
        <div className="space-y-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            >
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Pendiente de Pago"
                              ? "bg-red-100 text-red-700"
                              : item.status === "Recibido"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#333F48] mb-2">
                        {item.title}
                      </h2>
                      <div className="space-y-1">
                        <div className="text-sm text-[#A08C79]">
                          Subasta: <span className="font-semibold">{item.auctionName}</span>
                        </div>
                        <div className="text-sm text-[#A08C79]">
                          Fecha de compra: <span className="font-semibold">{item.purchaseDate}</span>
                        </div>
                        {item.status === "Pendiente de Pago" && item.paymentDeadline && (
                          <div className="text-sm text-red-600 font-semibold flex items-center gap-1">
                            <AlertTriangle size={14} />
                            Fecha límite de pago: {item.paymentDeadline}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#A08C79] mb-1">Precio Total</div>
                      <div className="text-3xl font-bold text-[#C9A063]">
                        ${item.total.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-semibold mb-4"
                    >
                      {expandedItems.has(item.id) ? (
                        <>
                          <ChevronUp size={20} />
                          Ocultar detalle de factura
                        </>
                      ) : (
                        <>
                          <ChevronDown size={20} />
                          Ver detalle de factura
                        </>
                      )}
                    </button>

                    {expandedItems.has(item.id) && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className="text-blue-600" size={20} />
                          <h3 className="font-bold text-[#333F48]">Detalle de Factura</h3>
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center pb-2">
                            <span className="text-sm text-[#A08C79]">Número de Factura</span>
                            <span className="font-semibold text-[#333F48]">{item.invoiceNumber}</span>
                          </div>

                          <div className="border-t border-blue-200 pt-3 space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#A08C79]">Precio de Puja Final</span>
                              <span className="font-semibold text-[#333F48]">${item.finalBid.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#A08C79]">Comisión (10%)</span>
                              <span className="font-semibold text-[#333F48]">${item.commission.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#A08C79]">Envío</span>
                              <span className="font-semibold text-[#333F48]">${item.shipping.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-[#A08C79]">Impuestos</span>
                              <span className="font-semibold text-[#333F48]">${item.taxes.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="border-t-2 border-blue-300 pt-3 mt-3">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-[#333F48]">Total</span>
                              <span className="font-bold text-[#C9A063] text-xl">${item.total.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {item.status === "Pendiente de Pago" && (
                      <div className="mt-4">
                        <button className="w-full px-6 py-3 bg-gradient-to-r from-[#C9A063] to-[#6A4F99] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold">
                          Proceder al Pago
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-gray-200">
            <ShoppingBag className="mx-auto mb-4 text-[#A08C79]" size={48} />
            <p className="text-[#A08C79] text-lg mb-4">
              {searchQuery || filterStatus !== "Todos"
                ? "No se encontraron compras con los filtros aplicados"
                : "Aún no has ganado ninguna subasta"}
            </p>
            {!searchQuery && filterStatus === "Todos" && (
              <Link
                to="/auctions"
                className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ver Subastas Disponibles
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
