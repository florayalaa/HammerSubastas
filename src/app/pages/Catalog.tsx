import { useParams, useNavigate } from 'react-router';
import { mockAuctions } from '../data/mockData';
import { ArrowLeft, Calendar, MapPin } from 'lucide-react';

export function Catalog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const auction = mockAuctions.find((a) => a.id === id);

  if (!auction) {
    return <div>Catálogo no encontrado</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="bg-primary text-white p-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-3">
          <button onClick={() => navigate('/auctions')} className="hover:opacity-80">
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h3 className="text-lg">{auction.name}</h3>
            <div className="flex items-center gap-3 text-sm opacity-90 mt-1">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{new Date(auction.date).toLocaleDateString('es-AR')}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin size={14} />
                <span>{auction.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catalog Items */}
      <div className="px-6 mt-6">
        <h3 className="text-foreground mb-4">
          Catálogo ({auction.items.length} artículos)
        </h3>

        <div className="space-y-6">
          {auction.items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="text-xs text-gray-500 mb-1">
                      Ítem {item.itemNumber}
                    </div>
                    <h4 className="text-foreground mb-2">{item.name}</h4>
                    {item.artist && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="text-gray-500">Artista:</span> {item.artist}
                      </p>
                    )}
                    {item.date && (
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-500">Año:</span> {item.date}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Precio base</p>
                    <p className="text-lg text-primary">
                      {auction.currency} {item.basePrice.toLocaleString()}
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                  {item.description}
                </p>

                {item.history && (
                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Historia</p>
                    <p className="text-sm text-gray-700 line-clamp-2">
                      {item.history}
                    </p>
                  </div>
                )}

                <button className="w-full mt-4 bg-primary/10 text-primary py-2 rounded-lg hover:bg-primary/20 transition-colors">
                  Ver detalles completos
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
