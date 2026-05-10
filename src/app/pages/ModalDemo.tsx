import { useState } from "react";
import { AuctionWonModal } from "../components/AuctionWonModal";
import { Trophy } from "lucide-react";

export function ModalDemo() {
  const [showWonModal, setShowWonModal] = useState(false);

  const wonAuctionData = {
    id: "1",
    itemName: "Reloj Rolex Submariner Vintage",
    finalBid: "USD 45,000",
    commission: "USD 4,500",
    taxes: "USD 1,250",
    shipping: "USD 250",
    total: "USD 51,000",
    image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">
            Demostración de Notificaciones
          </h1>
          <p className="text-[#A08C79]">
            Vista previa de las notificaciones de subasta
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Auction Won Card */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#C9A063] to-[#6A4F99] rounded-full mx-auto mb-4 flex items-center justify-center">
                <Trophy className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#333F48] mb-2">
                Subasta Ganada
              </h3>
              <p className="text-sm text-[#A08C79]">
                Se muestra cuando el usuario gana un artículo en la subasta
              </p>
            </div>

            <button
              onClick={() => setShowWonModal(true)}
              className="w-full px-6 py-3 bg-gradient-to-r from-[#C9A063] to-[#6A4F99] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Ver Modal
            </button>

            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-[#333F48] mb-2 text-sm">Características:</h4>
              <ul className="text-xs text-[#A08C79] space-y-1">
                <li>• Desglose completo de costos (puja, comisión, impuestos, envío)</li>
                <li>• Sección desplegable con próximos pasos</li>
                <li>• Opción de seguir viendo la subasta (multi-artículo)</li>
                <li>• Acceso directo a mis compras</li>
                <li>• Diseño celebratorio con gradiente</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-[#333F48] mb-3">
            Cuándo se muestra este modal:
          </h3>
          <div className="space-y-3 text-sm text-blue-900">
            <div>
              <strong>Subasta Ganada:</strong>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Cuando finaliza el tiempo de subasta de un artículo específico</li>
                <li>El usuario tiene la oferta más alta para ese artículo</li>
                <li>Se muestra automáticamente al cierre del artículo</li>
                <li>En subastas multi-artículo, permite seguir viendo la subasta después de ganar</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Note about "Vas Ganando" */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="font-semibold text-[#333F48] mb-3">
            Nota sobre "Vas Ganando":
          </h3>
          <p className="text-sm text-green-900">
            La funcionalidad de "Vas Ganando" se muestra directamente en la página de subasta en vivo
            (<strong>/auctions/:id/live</strong>) cuando el usuario es el mejor postor actual.
            La puja más alta cambia a un gradiente verde con texto "¡Tu puja está ganando!"
            para indicar visualmente que el usuario está liderando.
          </p>
        </div>
      </div>

      {/* Modal */}
      <AuctionWonModal
        isOpen={showWonModal}
        onClose={() => setShowWonModal(false)}
        auction={wonAuctionData}
      />
    </div>
  );
}
