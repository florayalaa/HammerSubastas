import { Link } from "react-router";
import { ChevronLeft, FileText, Download } from "lucide-react";

export function MyDocuments() {
  // Mock data para documentos
  const purchaseInvoices = [
    { id: "FAC-001", date: "2024-03-15", item: "Reloj Omega Vintage", amount: 15400, commission: 1540 },
    { id: "FAC-002", date: "2024-03-22", item: "Anillo de Diamantes", amount: 8900, commission: 890 },
  ];

  const salesRemittances = [
    { id: "REM-001", date: "2024-02-10", item: "Cuadro Abstracto", salePrice: 5200, commission: 520, netAmount: 4680 },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gray-50">
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
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Mis Documentos</h1>
          <p className="text-[#A08C79]">Facturas de compra y remitos de venta</p>
        </div>

        {/* Facturas de Compra */}
        <div className="mb-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#333F48] mb-4 flex items-center gap-2">
            <FileText size={20} className="text-primary" />
            Facturas de Compra
          </h2>
          {purchaseInvoices.length > 0 ? (
            <div className="space-y-3">
              {purchaseInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-[#333F48] mb-1">{invoice.id}</div>
                    <div className="text-sm text-[#A08C79]">{invoice.item}</div>
                    <div className="text-xs text-[#A08C79] mt-1">Fecha: {invoice.date}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-sm text-[#A08C79]">Total</div>
                    <div className="font-bold text-[#333F48]">${invoice.amount.toLocaleString()}</div>
                    <div className="text-xs text-[#A08C79]">Comisión: ${invoice.commission.toLocaleString()}</div>
                  </div>
                  <button className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A08C79] text-center py-4">No hay facturas disponibles</p>
          )}
        </div>

        {/* Remitos de Venta */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-[#333F48] mb-4 flex items-center gap-2">
            <FileText size={20} className="text-[#C9A063]" />
            Remitos de Venta
          </h2>
          {salesRemittances.length > 0 ? (
            <div className="space-y-3">
              {salesRemittances.map((remittance) => (
                <div
                  key={remittance.id}
                  className="flex items-center justify-between p-4 bg-[#C9A063]/10 rounded-lg border border-[#C9A063]/30 hover:border-[#C9A063] transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-[#333F48] mb-1">{remittance.id}</div>
                    <div className="text-sm text-[#A08C79]">{remittance.item}</div>
                    <div className="text-xs text-[#A08C79] mt-1">Fecha: {remittance.date}</div>
                  </div>
                  <div className="text-right mr-4">
                    <div className="text-xs text-[#A08C79]">Precio venta: ${remittance.salePrice.toLocaleString()}</div>
                    <div className="text-xs text-[#A08C79]">Comisión: ${remittance.commission.toLocaleString()}</div>
                    <div className="font-bold text-[#C9A063] mt-1">Neto: ${remittance.netAmount.toLocaleString()}</div>
                  </div>
                  <button className="p-2 bg-[#C9A063] text-white rounded-lg hover:bg-[#A08C79] transition-colors">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#A08C79] text-center py-4">No hay remitos disponibles</p>
          )}
        </div>
      </div>
    </div>
  );
}
