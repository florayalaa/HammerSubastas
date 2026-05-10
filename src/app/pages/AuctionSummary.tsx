import { Trophy, TrendingDown, DollarSign, Package, ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { Link, useParams } from "react-router";

export function AuctionSummary() {
  const { id } = useParams();

  const auctionData = {
    id: id || "1",
    title: "Subasta de Arte y Antigüedades - Colección Privada",
    date: "15 de Abril, 2026",
    totalItems: 8,
    totalRevenue: "USD 245,850",
  };

  const auctionedItems = [
    {
      id: "1",
      itemName: "Reloj Rolex Submariner Vintage",
      finalBid: "USD 45,000",
      winner: "user",
      winnerName: "Tú",
      image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "2",
      itemName: "Pintura Abstracta Moderna",
      finalBid: "USD 15,200",
      winner: "other",
      winnerName: "María González",
      image: "https://images.unsplash.com/photo-1609166816663-3dff820fc5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "3",
      itemName: "Escultura de Bronce Art Déco",
      finalBid: "USD 32,500",
      winner: "user",
      winnerName: "Tú",
      image: "https://images.unsplash.com/photo-1578926288207-e94a2a8e3d83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "4",
      itemName: "Juego de Porcelana China Antigua",
      finalBid: "USD 18,750",
      winner: "other",
      winnerName: "Carlos Ruiz",
      image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "5",
      itemName: "Manuscrito Original Siglo XVIII",
      finalBid: "USD 28,900",
      winner: "other",
      winnerName: "Ana Martínez",
      image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "6",
      itemName: "Lámpara Tiffany Original",
      finalBid: "USD 41,200",
      winner: "user",
      winnerName: "Tú",
      image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "7",
      itemName: "Reloj de Bolsillo Patek Philippe",
      finalBid: "USD 38,500",
      winner: "other",
      winnerName: "Roberto Sánchez",
      image: "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
    {
      id: "8",
      itemName: "Jarrón Ming Dinastía",
      finalBid: "USD 25,800",
      winner: "other",
      winnerName: "Laura Fernández",
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
    },
  ];

  const userWins = auctionedItems.filter((item) => item.winner === "user");
  const userTotal = userWins.reduce((sum, item) => {
    const value = parseFloat(item.finalBid.replace(/[^\d.]/g, ""));
    return sum + value;
  }, 0);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/auctions"
            className="inline-flex items-center gap-2 text-[#A08C79] hover:text-[#333F48] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Volver a Subastas
          </Link>
          <div className="bg-gradient-to-r from-[#6A4F99] to-[#C9A063] text-white rounded-lg p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center flex-shrink-0">
                <Trophy className="text-white" size={32} />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold mb-1">Subasta Finalizada</h1>
                <p className="text-white/90 text-sm sm:text-base">{auctionData.title}</p>
                <p className="text-white/70 text-xs sm:text-sm mt-1">{auctionData.date}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs sm:text-sm text-white/70 mb-1">Artículos</div>
                <div className="text-lg sm:text-xl font-bold">{auctionData.totalItems}</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <div className="text-xs sm:text-sm text-white/70 mb-1">Total Recaudado</div>
                <div className="text-lg sm:text-xl font-bold">{auctionData.totalRevenue}</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Summary */}
        {userWins.length > 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-[#C9A063]" size={24} />
              <h2 className="text-xl font-bold text-[#333F48]">Tus Artículos Ganados</h2>
            </div>
            <div className="bg-gradient-to-r from-[#C9A063] to-[#6A4F99] text-white rounded-lg p-4 mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <div className="text-xs sm:text-sm text-white/80 mb-1">Artículos ganados</div>
                  <div className="text-xl sm:text-2xl font-bold">{userWins.length}</div>
                </div>
                <div className="sm:text-right">
                  <div className="text-xs sm:text-sm text-white/80 mb-1">Total a Pagar</div>
                  <div className="text-xl sm:text-2xl font-bold">USD {userTotal.toLocaleString()}</div>
                </div>
              </div>
            </div>
            <Link
              to="/my-purchases"
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Package size={20} />
              Ver Mis Compras y Proceder al Pago
            </Link>
          </div>
        )}

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-[#333F48] mb-6">Resultados de la Subasta</h2>
          <div className="space-y-4">
            {auctionedItems.map((item, index) => (
              <div
                key={item.id}
                className={`border rounded-lg p-3 sm:p-4 transition-all ${
                  item.winner === "user"
                    ? "border-[#C9A063] bg-[#C9A063]/5"
                    : "border-gray-200"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="text-base sm:text-lg font-bold text-[#A08C79] w-6 sm:w-8 flex-shrink-0">
                    #{index + 1}
                  </div>
                  {item.image && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.itemName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#333F48] mb-2 text-sm sm:text-base">
                      {item.itemName}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm">
                        {item.winner === "user" ? (
                          <span className="inline-flex items-center gap-1 text-[#C9A063] font-semibold">
                            <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                            Ganaste este artículo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#A08C79]">
                            <XCircle size={14} className="sm:w-4 sm:h-4" />
                            Otro participante ganó
                          </span>
                        )}
                      </div>
                      <div className="sm:text-right">
                        <div className="text-xs text-[#A08C79] mb-1">Precio Final</div>
                        <div className="text-base sm:text-lg font-bold text-[#333F48]">
                          {item.finalBid}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/auctions"
            className="px-6 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <TrendingDown size={20} />
            Ver Otras Subastas
          </Link>
          <Link
            to="/my-bids"
            className="px-6 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
          >
            <DollarSign size={20} />
            Ver Mis Pujas
          </Link>
        </div>
      </div>
    </div>
  );
}
