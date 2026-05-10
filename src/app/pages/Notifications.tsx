import { Bell, Check, Trash2, Gavel, TrendingUp, AlertCircle, CheckCircle, XCircle, CreditCard, FileText, Package, Radio, Clock, DollarSign } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router';
import {
  createDocumentNotification,
  createProductNotification,
  createPaymentMethodNotification,
  createAuctionLiveNotification,
  createOfferReceivedNotification
} from '../utils/notificationHelpers';

export default function Notifications() {
  const { notifications, markAsRead, markAllAsRead, deleteNotification, unreadCount, addNotification } = useNotifications();
  const navigate = useNavigate();

  const createExampleNotifications = () => {
    // Documento aprobado
    addNotification(createDocumentNotification(true, "DNI Frente y Dorso"));

    // Documento rechazado
    setTimeout(() => {
      addNotification(createDocumentNotification(false, "Comprobante de Domicilio", "La imagen no es legible."));
    }, 300);

    // Producto aprobado
    setTimeout(() => {
      addNotification(createProductNotification(true, "Reloj Omega Speedmaster", undefined, "1"));
    }, 600);

    // Producto rechazado
    setTimeout(() => {
      addNotification(createProductNotification(false, "Anillo de Oro", "No se pudo verificar la autenticidad del material."));
    }, 900);

    // Medio de pago aprobado
    setTimeout(() => {
      addNotification(createPaymentMethodNotification(true, "Tarjeta Visa ****4532"));
    }, 1200);

    // Medio de pago rechazado
    setTimeout(() => {
      addNotification(createPaymentMethodNotification(false, "Cheque Certificado #12345", "El monto no coincide con lo declarado."));
    }, 1500);

    // Subasta en vivo
    setTimeout(() => {
      addNotification(createAuctionLiveNotification("Subasta de Arte Contemporáneo", "1"));
    }, 1800);

    // Subasta próxima
    setTimeout(() => {
      addNotification({
        type: 'auction_upcoming',
        title: 'Subasta Próxima',
        message: 'La subasta "Colección de Relojes de Lujo" comenzará en 2 horas. ¡Prepárate!',
        auctionId: '2'
      });
    }, 2100);

    // Subasta ganada
    setTimeout(() => {
      addNotification({
        type: 'auction_won',
        title: '¡Felicitaciones! Has ganado la subasta',
        message: 'Ganaste la subasta "Anillo de Diamantes Art Déco" con una puja de $45,000. Te contactaremos pronto con los detalles de pago y envío.',
        auctionId: '3'
      });
    }, 2400);

    // Subasta perdida
    setTimeout(() => {
      addNotification({
        type: 'auction_lost',
        title: 'Subasta Finalizada',
        message: 'La subasta "Pintura Abstracta Moderna" ha finalizado. No obtuviste la mejor puja esta vez.',
        auctionId: '1'
      });
    }, 2700);

    // Oferta recibida
    setTimeout(() => {
      addNotification(createOfferReceivedNotification("Escultura de Mármol Contemporánea", 18000, 1800, "6"));
    }, 3000);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'auction_won':
        return <Gavel className="w-6 h-6 text-[#C9A063]" />;
      case 'auction_lost':
        return <AlertCircle className="w-6 h-6 text-[#999999]" />;
      case 'auction_upcoming':
        return <Clock className="w-6 h-6 text-[#6A4F99]" />;
      case 'outbid':
        return <TrendingUp className="w-6 h-6 text-[#6A4F99]" />;
      case 'document_approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'document_rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'product_approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'product_rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'payment_approved':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'payment_rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      case 'auction_live':
        return <Radio className="w-6 h-6 text-red-500" />;
      case 'offer_received':
        return <DollarSign className="w-6 h-6 text-[#C9A063]" />;
      default:
        return <Bell className="w-6 h-6 text-[#6A4F99]" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'auction_won':
        return 'bg-[#C9A063]/10 border-[#C9A063]';
      case 'auction_lost':
        return 'bg-gray-100 border-gray-300';
      case 'auction_upcoming':
        return 'bg-[#6A4F99]/10 border-[#6A4F99]';
      case 'outbid':
        return 'bg-[#6A4F99]/10 border-[#6A4F99]';
      case 'document_approved':
      case 'product_approved':
      case 'payment_approved':
        return 'bg-green-50 border-green-500';
      case 'document_rejected':
      case 'product_rejected':
      case 'payment_rejected':
        return 'bg-red-50 border-red-500';
      case 'auction_live':
        return 'bg-red-50 border-red-500';
      case 'offer_received':
        return 'bg-[#C9A063]/10 border-[#C9A063]';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days} días`;
    return date.toLocaleDateString('es-AR');
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.auctionId) {
      navigate(`/auctions/${notification.auctionId}`);
    } else if (notification.saleItemId) {
      navigate('/my-sales');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F3F7] to-[#E8E4EC] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg border-2 border-[#6A4F99] shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#6A4F99] rounded-lg flex items-center justify-center">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#6A4F99]">Notificaciones</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `Tienes ${unreadCount} notificación${unreadCount > 1 ? 'es' : ''} sin leer` : 'No tienes notificaciones sin leer'}
                </p>
              </div>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 bg-[#6A4F99] text-white rounded-lg hover:bg-[#5A3F89] transition-colors"
              >
                <Check className="w-4 h-4" />
                Marcar todo como leído
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes notificaciones</h3>
            <p className="text-gray-600 mb-6">
              Cuando participes en subastas o haya novedades, aparecerán aquí
            </p>
            <button
              onClick={createExampleNotifications}
              className="px-6 py-3 bg-[#6A4F99] text-white rounded-lg hover:bg-[#5A3F89] transition-colors"
            >
              Ver Ejemplos de Notificaciones
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg border-2 ${getNotificationColor(notification.type)} shadow-md overflow-hidden transition-all hover:shadow-lg ${
                  !notification.read ? 'ring-2 ring-[#C9A063]/50' : ''
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`flex-shrink-0 w-12 h-12 ${getNotificationColor(notification.type)} rounded-lg flex items-center justify-center`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {notification.title}
                          {!notification.read && (
                            <span className="ml-2 inline-block w-2 h-2 bg-[#C9A063] rounded-full"></span>
                          )}
                        </h3>
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {notification.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="flex-shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar notificación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons for Auction Notifications */}
                {notification.auctionId && (
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                    <button
                      onClick={() => handleNotificationClick(notification)}
                      className="text-sm text-[#6A4F99] hover:text-[#5A3F89] font-medium"
                    >
                      Ver detalles de la subasta →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}