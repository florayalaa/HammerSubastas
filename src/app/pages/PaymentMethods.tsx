import { Link } from "react-router";
import { CreditCard, Building2, FileCheck, Plus, Trash2, CheckCircle, Info, ChevronDown, ChevronUp, ChevronLeft } from "lucide-react";
import { useState } from "react";

export function PaymentMethods() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "bank" | "check">("card");
  const [showInfoBanner, setShowInfoBanner] = useState(false);

  const paymentMethods = [
    {
      id: 1,
      type: "card",
      name: "Visa **** 4532",
      status: "verified",
      details: "Vence 08/2027",
      icon: CreditCard,
    },
    {
      id: 2,
      type: "bank",
      name: "Banco Santander",
      status: "verified",
      details: "Cuenta USD ****7890",
      icon: Building2,
    },
    {
      id: 3,
      type: "check",
      name: "Cheque Certificado",
      status: "verified",
      details: "Monto: $50,000 USD",
      icon: FileCheck,
    },
    {
      id: 4,
      type: "card",
      name: "Mastercard **** 8821",
      status: "pending",
      details: "Verificación pendiente",
      icon: CreditCard,
    },
  ];

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    // Mostrar modal de confirmación
    setShowConfirmModal(true);
  };

  const handleConfirmAdd = () => {
    setShowConfirmModal(false);
    setShowAddModal(false);
    alert("Método de pago agregado. Será verificado en las próximas 24-48 horas.");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 mb-4 text-[#A08C79] hover:text-[#333F48] transition-colors"
          >
            <ChevronLeft size={20} />
            Volver al Perfil
          </Link>
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Medios de Pago</h1>
          <p className="text-[#A08C79]">
            Gestiona tus métodos de pago para participar en subastas
          </p>
        </div>

        {/* Info Banner - Desplegable */}
        <div className="mb-8">
          <button
            onClick={() => setShowInfoBanner(!showInfoBanner)}
            className="w-full flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="text-blue-600" size={20} />
              <span className="font-semibold text-[#333F48]">Información Importante</span>
            </div>
            {showInfoBanner ? <ChevronUp size={20} className="text-blue-600" /> : <ChevronDown size={20} className="text-blue-600" />}
          </button>

          {showInfoBanner && (
            <div className="bg-blue-50 border border-blue-200 border-t-0 rounded-b-lg p-4 -mt-2">
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
                <li>Necesitas al menos un método de pago verificado para pujar en subastas</li>
                <li>Los métodos de pago aumentan tu categoría de usuario</li>
                <li>Las verificaciones toman entre 24-48 horas</li>
                <li>Los cheques certificados deben ser entregados antes de la subasta</li>
              </ul>
            </div>
          )}
        </div>

        {/* Add Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Agregar Método de Pago
          </button>
        </div>

        {/* Payment Methods List */}
        <div className="space-y-4">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <div
                key={method.id}
                className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-[#333F48]">{method.name}</h3>
                        {method.status === "verified" && (
                          <CheckCircle className="text-green-600" size={18} />
                        )}
                      </div>
                      <p className="text-sm text-[#A08C79]">{method.details}</p>
                      {method.status === "verified" ? (
                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Pendiente de Verificación
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    onClick={() => {
                      if (confirm("¿Estás seguro de eliminar este método de pago?")) {
                        alert("Método de pago eliminado");
                      }
                    }}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {paymentMethods.length === 0 && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-12 text-center">
            <p className="text-[#A08C79] mb-4">No tienes métodos de pago registrados</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Agregar tu primer método
            </button>
          </div>
        )}
      </div>

      {/* Add Payment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-[#333F48] mb-6">
              Agregar Método de Pago
            </h2>

            <form onSubmit={handleAddPaymentMethod} className="space-y-6">
              {/* Payment Type Selection */}
              <div>
                <label className="block mb-3 text-[#333F48]">Tipo de Método</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentType("card")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentType === "card"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <CreditCard className="mx-auto mb-2 text-primary" size={24} />
                    <span className="text-sm text-[#333F48]">Tarjeta</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("bank")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentType === "bank"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <Building2 className="mx-auto mb-2 text-primary" size={24} />
                    <span className="text-sm text-[#333F48]">Banco</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentType("check")}
                    className={`p-4 border-2 rounded-lg transition-colors ${
                      paymentType === "check"
                        ? "border-primary bg-primary/10"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <FileCheck className="mx-auto mb-2 text-primary" size={24} />
                    <span className="text-sm text-[#333F48]">Cheque</span>
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              {paymentType === "card" && (
                <>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Número de Tarjeta</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2 text-[#333F48]">Vencimiento</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-2 text-[#333F48]">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {paymentType === "bank" && (
                <>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Nombre del Banco</label>
                    <input
                      type="text"
                      placeholder="Ej: Banco Santander"
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Número de Cuenta</label>
                    <input
                      type="text"
                      placeholder="1234567890"
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Tipo de Moneda</label>
                    <select
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="USD">USD</option>
                      <option value="ARS">ARS</option>
                    </select>
                  </div>
                </>
              )}

              {paymentType === "check" && (
                <>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Número de Cheque</label>
                    <input
                      type="text"
                      placeholder="CH-123456"
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-[#333F48]">Monto (USD)</label>
                    <input
                      type="number"
                      placeholder="50000"
                      className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                    El cheque certificado debe ser entregado físicamente antes del inicio de la subasta.
                  </div>
                </>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#333F48] mb-4">
              Confirmar Método de Pago
            </h2>
            <p className="text-sm text-[#A08C79] mb-6">
              ¿Estás seguro de que deseas agregar este método de pago? Por favor, verifica que toda la información ingresada sea correcta antes de continuar.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-800">
                <strong>Nota:</strong> El método de pago será enviado para verificación y estará disponible en 24-48 horas.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold"
              >
                Volver a Revisar
              </button>
              <button
                type="button"
                onClick={handleConfirmAdd}
                className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
