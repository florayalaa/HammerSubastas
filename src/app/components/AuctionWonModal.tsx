import { Trophy, DollarSign, Package, CreditCard, X, ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

interface AuctionWonModalProps {
  isOpen: boolean;
  onClose: () => void;
  auction: {
    id: string;
    itemName: string;
    finalBid: string;
    commission: string;
    taxes: string;
    shipping: string;
    total: string;
    image?: string;
  };
}

export function AuctionWonModal({ isOpen, onClose, auction }: AuctionWonModalProps) {
  const [showNextSteps, setShowNextSteps] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C9A063] to-[#6A4F99] p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <div className="text-center">
            <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
              <Trophy className="text-[#C9A063]" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">¡Felicitaciones!</h2>
            <p className="text-white/90">Has ganado la subasta</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Item Info */}
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {auction.image && (
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={auction.image} alt={auction.itemName} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-[#333F48] text-lg mb-1">
                  {auction.itemName}
                </h3>
                <p className="text-sm text-[#A08C79]">Subasta #{auction.id}</p>
              </div>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A08C79]">Puja ganadora</span>
              <span className="font-semibold text-[#333F48]">{auction.finalBid}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A08C79]">Comisión</span>
              <span className="font-semibold text-[#333F48]">{auction.commission}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A08C79]">Impuestos</span>
              <span className="font-semibold text-[#333F48]">{auction.taxes}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[#A08C79]">Envío</span>
              <span className="font-semibold text-[#333F48]">{auction.shipping}</span>
            </div>
            <div className="border-t border-gray-300 pt-3 flex justify-between items-center">
              <span className="font-semibold text-[#333F48]">Total a Pagar</span>
              <span className="text-xl font-bold text-[#C9A063]">{auction.total}</span>
            </div>
          </div>

          {/* Próximos Pasos - Desplegable */}
          <div className="mb-6">
            <button
              onClick={() => setShowNextSteps(!showNextSteps)}
              className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="font-semibold text-[#333F48]">Próximos Pasos</span>
              {showNextSteps ? (
                <ChevronUp size={20} className="text-blue-600" />
              ) : (
                <ChevronDown size={20} className="text-blue-600" />
              )}
            </button>

            {showNextSteps && (
              <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg p-4 -mt-2">
                <ul className="list-disc list-inside space-y-2 text-sm text-blue-900">
                  <li>Debes completar el pago dentro de las próximas 72 horas</li>
                  <li>Recibirás un email con las instrucciones de pago</li>
                  <li>Puedes retirar el artículo personalmente o solicitar envío</li>
                  <li>Si retiras personalmente, pierdes la cobertura del seguro</li>
                </ul>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Eye size={20} />
              Seguir Viendo la Subasta
            </button>
            <Link
              to="/my-purchases"
              className="w-full px-6 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold flex items-center justify-center gap-2"
              onClick={onClose}
            >
              <Package size={20} />
              Ir a Mis Compras
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
