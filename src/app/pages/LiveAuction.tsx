import { useParams, Link, useNavigate } from "react-router";
import { ChevronLeft, TrendingUp, AlertCircle, Lock, Trophy, XCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export function LiveAuction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bidAmount, setBidAmount] = useState("");
  const [manualBidAmount, setManualBidAmount] = useState("");
  const [currentBid, setCurrentBid] = useState(45000);
  const [timeRemaining, setTimeRemaining] = useState(125);
  const [isHighestBidder, setIsHighestBidder] = useState(false);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [manualBidError, setManualBidError] = useState("");
  const { isAuthenticated, user } = useAuth();
  const { addNotification } = useNotifications();
  const userCategory = user?.category || "Común";

  // Mock: Fondos disponibles del usuario (simulado)
  const userAvailableFunds = 75000; // USD

  // Mock: Métodos de pago del usuario
  const paymentMethods = [
    { id: "1", type: "Tarjeta de Crédito", name: "Visa ****1234", available: 50000 },
    { id: "2", type: "Cheque Certificado", name: "Cheque #98765", available: 80000 },
    { id: "3", type: "Transferencia Bancaria", name: "Cuenta corriente", available: 120000 },
  ];

  const auction = {
    id: Number(id),
    title: "Subasta de Arte Contemporáneo",
    currentItem: {
      id: 1,
      itemNumber: "001",
      title: "Anillo de Diamantes Art Déco",
      description: "Exquisito anillo de platino con diamante central de 3.5 quilates.",
      basePrice: 45000,
      image: "https://images.unsplash.com/photo-1742240439165-60790db1ee93?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBkaWFtb25kJTIwcmluZ3xlbnwxfHx8fDE3NzM2MzgxNDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    },
    currency: "USD",
  };

  // Calcular límites de puja (solo para categorías no-oro/platino)
  const minIncrease = auction.currentItem.basePrice * 0.01; // 1%
  const maxIncrease = auction.currentItem.basePrice * 0.20; // 20%
  const minBid = currentBid + minIncrease;
  const maxBid = currentBid + maxIncrease;

  // Simular actualizaciones en tiempo real
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // La subasta ha terminado
          setAuctionEnded(true);
          
          // Crear notificación si el usuario ganó
          if (isAuthenticated && isHighestBidder) {
            addNotification({
              type: 'auction_won',
              title: '¡Felicitaciones! Has ganado la subasta',
              message: `Ganaste la subasta "${auction.currentItem.title}" con una puja de $${currentBid.toLocaleString()}`,
              auctionId: id
            });
          } else if (isAuthenticated && !isHighestBidder) {
            addNotification({
              type: 'auction_lost',
              title: 'Subasta finalizada',
              message: `La subasta "${auction.currentItem.title}" ha finalizado. No obtuviste la mejor puja.`,
              auctionId: id
            });
          }
          
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isAuthenticated, isHighestBidder, currentBid, auction.currentItem.title, id, addNotification]);

  // Simular que otro usuario hace una puja más alta (solo para demostración)
  // NOTA: No se notifica cuando otro usuario puja más alto
  useEffect(() => {
    if (!isAuthenticated || auctionEnded) return;

    // Simular una puja externa después de 30 segundos
    const outbidTimer = setTimeout(() => {
      if (isHighestBidder && !auctionEnded) {
        const newBid = currentBid + minIncrease * 2;
        setCurrentBid(newBid);
        setIsHighestBidder(false);
        // No crear notificación de "outbid" - el usuario debe estar atento a la subasta
      }
    }, 30000); // 30 segundos

    return () => clearTimeout(outbidTimer);
  }, [isAuthenticated, isHighestBidder, currentBid, minIncrease, auctionEnded]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleBid = (e: React.FormEvent) => {
    e.preventDefault();

    if (auctionEnded) {
      alert('La subasta ha finalizado. No se pueden realizar más pujas.');
      return;
    }

    const amount = parseFloat(bidAmount);

    // Validar fondos disponibles
    if (amount > userAvailableFunds) {
      alert(
        `⚠️ Fondos insuficientes\n\n` +
        `Tu puja de $${amount.toLocaleString()} supera los fondos disponibles en tu medio de pago ($${userAvailableFunds.toLocaleString()}).\n\n` +
        `Por favor, verifica tus medios de pago o reduce el monto de la puja.\n\n` +
        `Nota: No se pueden combinar medios de pago en una misma puja.`
      );
      return;
    }

    if (amount < minBid) {
      alert(`La puja mínima es $${minBid.toLocaleString()}`);
      return;
    }

    if (userCategory !== "Oro" && userCategory !== "Platino" && amount > maxBid) {
      alert(`La puja máxima para tu categoría es $${maxBid.toLocaleString()}`);
      return;
    }

    setCurrentBid(amount);
    setIsHighestBidder(true);
    setBidAmount("");
    alert("¡Puja enviada con éxito!");
  };

  // Modal de fin de subasta
  const AuctionEndedModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {isHighestBidder ? (
          // Usuario ganó
          <div className="bg-gradient-to-br from-[#C9A063] to-[#A08C79] text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">¡Felicitaciones!</h2>
            <p className="text-white/90 text-lg">Has ganado la subasta</p>
          </div>
        ) : (
          // Usuario no ganó
          <div className="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-8 text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Subasta Finalizada</h2>
            <p className="text-white/90 text-lg">La subasta ha terminado</p>
          </div>
        )}
        
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">{auction.currentItem.title}</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Puja final:</span>
                <span className="font-bold text-gray-900">${currentBid.toLocaleString()}</span>
              </div>
              {isHighestBidder ? (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-bold text-[#C9A063]">Ganador</span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="font-bold text-gray-600">No ganaste</span>
                </div>
              )}
            </div>
          </div>

          {isHighestBidder && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                Te enviaremos un correo electrónico con los próximos pasos para completar tu compra.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/auctions')}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Ver Subastas
            </button>
            <button
              onClick={() => navigate('/notifications')}
              className="flex-1 px-4 py-3 bg-[#6A4F99] text-white rounded-lg hover:bg-[#5A3F89] transition-colors font-medium"
            >
              Ir a Notificaciones
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50">
      {/* Modal de fin de subasta */}
      {auctionEnded && isAuthenticated && <AuctionEndedModal />}

      {/* Header */}
      <div className="bg-gradient-to-r from-[#6A4F99] to-[#C9A063] text-white py-4 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link
              to={`/auctions/${id}`}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
              Salir
            </Link>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${auctionEnded ? 'bg-gray-500' : 'bg-red-500'}`}>
              {!auctionEnded && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
              <span className="font-semibold">{auctionEnded ? 'FINALIZADA' : 'EN VIVO'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-3">
            {/* Current Item - Compacto sin scroll */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex gap-4 mb-4">
                  {/* Imagen más pequeña */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <ImageWithFallback
                      src={auction.currentItem.image}
                      alt={auction.currentItem.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Información condensada */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-[#333F48] mb-2 truncate">
                      {auction.currentItem.title}
                    </h2>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-xs text-[#A08C79] mb-1">Precio Base</div>
                        <div className="text-sm font-semibold text-[#333F48]">
                          ${auction.currentItem.basePrice.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#A08C79] mb-1">Tiempo Restante</div>
                        <div className="text-sm font-semibold text-red-500">
                          {formatTime(timeRemaining)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {isAuthenticated ? (
                  <div className={`p-4 rounded-lg transition-all ${
                    isHighestBidder
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                      : 'bg-gradient-to-r from-[#6A4F99] to-[#C9A063] text-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm opacity-80 mb-1">
                          {isHighestBidder ? '¡Tu puja está ganando!' : 'Puja Actual'}
                        </div>
                        <div className="text-2xl font-bold">
                          ${currentBid.toLocaleString()}
                        </div>
                      </div>
                      <TrendingUp size={28} />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 border border-gray-300 p-4 rounded-lg text-center">
                    <Lock className="mx-auto mb-2 text-gray-400" size={24} />
                    <p className="text-gray-600 text-sm">
                      Inicia sesión para ver el precio de la puja
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3">
            {/* Bid Form */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              {!isAuthenticated ? (
                <div className="text-center py-8">
                  <Lock className="mx-auto mb-4 text-[#A08C79]" size={48} />
                  <p className="text-[#A08C79] mb-4">
                    Debes iniciar sesión para participar en esta subasta
                  </p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                </div>
              ) : !selectedPaymentMethod ? (
                // Selector de método de pago (mobile first)
                <div className="space-y-4">
                  <p className="text-sm text-[#A08C79]">
                    Selecciona un método de pago para participar en la subasta
                  </p>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                    >
                      <div className="font-semibold text-[#333F48]">{method.type}</div>
                      <div className="text-sm text-[#A08C79]">{method.name}</div>
                      <div className="text-sm text-[#C9A063] mt-1">
                        Disponible: ${method.available.toLocaleString()}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={18} className="text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="mb-1">
                          Puja mínima: <strong>${minBid.toLocaleString()}</strong>
                        </p>
                        {userCategory !== "Oro" && userCategory !== "Platino" && (
                          <p>
                            Puja máxima: <strong>${maxBid.toLocaleString()}</strong>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setManualBidAmount(minBid.toString())}
                        className="px-3 py-2 bg-gray-100 text-[#333F48] rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        Mínima
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualBidAmount((currentBid + minIncrease * 5).toString())}
                        className="px-3 py-2 bg-gray-100 text-[#333F48] rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        +5%
                      </button>
                      <button
                        type="button"
                        onClick={() => setManualBidAmount((currentBid + minIncrease * 10).toString())}
                        className="px-3 py-2 bg-gray-100 text-[#333F48] rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      >
                        +10%
                      </button>
                    </div>

                    {/* Input manual para la puja */}
                    <div>
                      <label className="block mb-2 text-sm font-semibold text-[#333F48]">
                        Ingresa el monto de tu puja:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          placeholder={`Mín: ${minBid.toLocaleString()}`}
                          value={manualBidAmount}
                          onChange={(e) => {
                            setManualBidAmount(e.target.value);
                            setManualBidError("");
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (auctionEnded) {
                              alert('La subasta ha finalizado. No se pueden realizar más pujas.');
                              return;
                            }

                            const amount = parseFloat(manualBidAmount);
                            if (isNaN(amount)) {
                              setManualBidError("Por favor ingresa un monto válido");
                              return;
                            }
                            if (amount < minBid) {
                              setManualBidError(`La puja mínima es $${minBid.toLocaleString()}`);
                              return;
                            }
                            if (userCategory !== "Oro" && userCategory !== "Platino" && amount > maxBid) {
                              setManualBidError(`La puja máxima para tu categoría es $${maxBid.toLocaleString()}`);
                              return;
                            }
                            
                            // Validar fondos disponibles
                            if (amount > userAvailableFunds) {
                              alert(
                                `⚠️ Fondos insuficientes\n\n` +
                                `Tu puja de $${amount.toLocaleString()} supera los fondos disponibles en tu medio de pago ($${userAvailableFunds.toLocaleString()}).\n\n` +
                                `Por favor, verifica tus medios de pago o reduce el monto de la puja.\n\n` +
                                `Nota: No se pueden combinar medios de pago en una misma puja.`
                              );
                              return;
                            }

                            // Enviar puja
                            setCurrentBid(amount);
                            setIsHighestBidder(true);
                            setManualBidAmount("");
                            setManualBidError("");
                            alert("¡Puja enviada con éxito!");
                          }}
                          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                        >
                          Enviar
                        </button>
                      </div>
                      {manualBidError && (
                        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 font-semibold">{manualBidError}</p>
                        </div>
                      )}
                    </div>

                    {/* Método de pago - Botón único */}
                    <div className="pt-4 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod("")}
                        className="w-full px-4 py-3 text-left bg-green-50 border border-green-300 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs text-green-700">Medio de pago</div>
                            <div className="font-semibold text-green-900">
                              {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                            </div>
                          </div>
                          <div className="text-xs text-green-700 font-semibold">
                            Cambiar →
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}