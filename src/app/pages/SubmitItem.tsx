import { useState } from 'react';
import { mockSubmissions } from '../data/mockData';
import { BottomNav } from '../components/BottomNav';
import { Upload, ImagePlus, CheckCircle, Clock, XCircle, Package } from 'lucide-react';

export function SubmitItem() {
  const [activeTab, setActiveTab] = useState<'submit' | 'history'>('submit');
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [artistInfo, setArtistInfo] = useState('');
  const [ownershipConfirmed, setOwnershipConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Artículo enviado para inspección');
    setItemName('');
    setDescription('');
    setArtistInfo('');
    setOwnershipConfirmed(false);
  };

  const statusConfig = {
    pending: { icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Pendiente' },
    inspecting: { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', label: 'En inspección' },
    accepted: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', label: 'Aceptado' },
    rejected: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Rechazado' },
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-6 rounded-b-3xl shadow-lg mb-6">
        <h2 className="text-2xl mb-2">Subastar Artículos</h2>
        <p className="text-sm opacity-90">Envía tus artículos para subasta</p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-1 flex">
          <button
            onClick={() => setActiveTab('submit')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'submit'
                ? 'bg-primary text-white'
                : 'text-gray-600'
            }`}
          >
            Enviar artículo
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-lg transition-colors ${
              activeTab === 'history'
                ? 'bg-primary text-white'
                : 'text-gray-600'
            }`}
          >
            Mis envíos
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        <div className="px-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Images Upload */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Imágenes del artículo (mínimo 6)
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-primary transition-colors"
                  >
                    <ImagePlus size={32} className="text-gray-400" />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Las imágenes deben mostrar el artículo desde diferentes ángulos
              </p>
            </div>

            {/* Item Name */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Nombre del artículo
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ej: Jarrón de porcelana china"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Descripción detallada
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Describe el artículo, su estado, medidas, etc."
                required
              />
            </div>

            {/* Artist/Designer Info */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Información del artista/diseñador (opcional)
              </label>
              <input
                type="text"
                value={artistInfo}
                onChange={(e) => setArtistInfo(e.target.value)}
                className="w-full px-4 py-3 bg-input-background rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nombre del artista o diseñador"
              />
            </div>

            {/* Document Upload */}
            <div>
              <label className="block text-sm mb-2 text-foreground">
                Documentación de origen (opcional)
              </label>
              <div className="bg-gray-100 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center cursor-pointer hover:border-primary transition-colors">
                <Upload size={40} className="mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Sube facturas, certificados u otros documentos
                </p>
              </div>
            </div>

            {/* Ownership Confirmation */}
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ownershipConfirmed}
                  onChange={(e) => setOwnershipConfirmed(e.target.checked)}
                  className="mt-1"
                  required
                />
                <span className="text-sm text-gray-700">
                  Declaro que el artículo es de mi propiedad y no posee ningún impedimento
                  legal para ser subastado. Acepto que la empresa puede verificar el origen
                  del bien y notificar a las autoridades en caso de duda.
                </span>
              </label>
            </div>

            {/* Information Note */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-900">
                <strong>Importante:</strong> Una vez enviado, la empresa inspeccionará el
                artículo. Si es aceptado, recibirás información sobre el valor base y las
                comisiones. Los costos de envío y devolución son a cargo del propietario.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!ownershipConfirmed}
            >
              Enviar artículo para inspección
            </button>
          </form>
        </div>
      ) : (
        <div className="px-6 space-y-4">
          {mockSubmissions.map((submission) => {
            const config = statusConfig[submission.status];
            const StatusIcon = config.icon;

            return (
              <div key={submission.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="flex">
                  <img
                    src={submission.images[0]}
                    alt={submission.itemName}
                    className="w-24 h-24 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <h4 className="text-foreground mb-1">{submission.itemName}</h4>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {submission.description}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}>
                      <StatusIcon size={12} />
                      {config.label}
                    </div>
                  </div>
                </div>

                {submission.status === 'accepted' && submission.basePrice && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-500">Precio base</p>
                        <p className="text-foreground">USD {submission.basePrice.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Comisión</p>
                        <p className="text-foreground">{submission.commission}%</p>
                      </div>
                    </div>
                    {submission.auctionDate && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500">Fecha de subasta</p>
                        <p className="text-sm text-foreground">
                          {new Date(submission.auctionDate).toLocaleDateString('es-AR')}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {submission.status === 'rejected' && submission.rejectionReason && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Motivo del rechazo</p>
                    <p className="text-sm text-red-600">{submission.rejectionReason}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <BottomNav />
    </div>
  );
}
