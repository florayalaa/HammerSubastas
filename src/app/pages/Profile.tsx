import { User, Mail, MapPin, Globe, Shield, CreditCard, Award, Package, FileText, ShoppingBag } from "lucide-react";
import { Link } from "react-router";

export function Profile() {
  const userProfile = {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    address: "Av. Libertador 5432, Buenos Aires",
    country: "Argentina",
    category: "Oro",
    verified: true,
    memberSince: "Enero 2024",
    paymentMethods: 3,
    totalBids: 45,
    wonAuctions: 8,
    totalSpent: "$125,400",
  };

  const categoryColors: Record<string, string> = {
    "Común": "#A08C79",
    "Especial": "#6A4F99",
    "Plata": "#C0C0C0",
    "Oro": "#C9A063",
    "Platino": "#E2C3BC",
  };

  // Estadísticas para scroll horizontal
  const stats = [
    { label: "Miembro Desde", value: userProfile.memberSince },
    { label: "Métodos de Pago", value: userProfile.paymentMethods },
    { label: "Pujas Totales", value: userProfile.totalBids },
    { label: "Subastas Ganadas", value: userProfile.wonAuctions },
    { label: "Total Invertido", value: userProfile.totalSpent, highlight: true },
  ];

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Mi Perfil</h1>
          <p className="text-[#A08C79]">Información de tu cuenta y estadísticas</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#333F48]">Información Personal</h2>
                <Link
                  to="/profile/edit"
                  className="px-4 py-2 text-primary hover:bg-primary/10 rounded-lg transition-colors font-semibold"
                >
                  Editar
                </Link>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="text-[#A08C79] mt-1" size={20} />
                  <div>
                    <div className="text-sm text-[#A08C79] mb-1">Nombre Completo</div>
                    <div className="font-semibold text-[#333F48]">
                      {userProfile.firstName} {userProfile.lastName}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="text-[#A08C79] mt-1" size={20} />
                  <div>
                    <div className="text-sm text-[#A08C79] mb-1">Correo Electrónico</div>
                    <div className="font-semibold text-[#333F48]">{userProfile.email}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-[#A08C79] mt-1" size={20} />
                  <div>
                    <div className="text-sm text-[#A08C79] mb-1">Domicilio Legal</div>
                    <div className="font-semibold text-[#333F48]">{userProfile.address}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="text-[#A08C79] mt-1" size={20} />
                  <div>
                    <div className="text-sm text-[#A08C79] mb-1">País de Origen</div>
                    <div className="font-semibold text-[#333F48]">{userProfile.country}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Account Statistics - Scroll Horizontal */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-[#333F48] mb-6">Estadísticas de Cuenta</h2>

              <div className="overflow-x-auto -mx-2 px-2">
                <div className="flex gap-4 min-w-max pb-2">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 w-40 p-4 rounded-lg ${
                        stat.highlight
                          ? 'bg-gradient-to-br from-[#C9A063] to-[#A08C79] text-white'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div className={`text-sm mb-1 ${stat.highlight ? 'text-white/80' : 'text-[#A08C79]'}`}>
                        {stat.label}
                      </div>
                      <div className={`text-lg font-bold ${stat.highlight ? 'text-white' : 'text-[#333F48]'}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Status Card */}
          <div className="space-y-6">
            {/* Category Card */}
            <div className="bg-gradient-to-br from-[#6A4F99] to-[#C9A063] text-white rounded-lg shadow-lg p-6">
              <div className="text-center mb-6">
                <div
                  className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-white"
                  style={{ backgroundColor: categoryColors[userProfile.category] }}
                >
                  <Award size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-1">Categoría {userProfile.category}</h3>
                {userProfile.verified && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm">
                    <Shield size={16} />
                    <span>Cuenta Verificada</span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <div className="text-sm opacity-80 mb-1">Nivel de Acceso</div>
                  <div className="font-semibold">Subastas {userProfile.category} y menores</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-[#333F48] mb-4">Acciones Rápidas</h3>

              <div className="space-y-3">
                <Link
                  to="/payment-methods"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <CreditCard className="text-primary" size={20} />
                  <span className="text-[#333F48]">Medios de Pago</span>
                </Link>

                <Link
                  to="/my-purchases"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ShoppingBag className="text-primary" size={20} />
                  <span className="text-[#333F48]">Mis Compras</span>
                </Link>

                <Link
                  to="/my-sales"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Package className="text-primary" size={20} />
                  <span className="text-[#333F48]">Mis Ventas</span>
                </Link>

                <Link
                  to="/my-documents"
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <FileText className="text-primary" size={20} />
                  <span className="text-[#333F48]">Mis Documentos</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
