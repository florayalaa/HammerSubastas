import { Link } from "react-router";
import { Gavel, Shield, TrendingUp, Clock } from "lucide-react";

export function Home() {
  const features = [
    {
      icon: Gavel,
      title: "Subastas en Tiempo Real",
      description: "Participa en subastas dinámicas con actualizaciones en vivo",
    },
    {
      icon: Shield,
      title: "Seguridad Garantizada",
      description: "Verificación completa de usuarios y transacciones seguras",
    },
    {
      icon: TrendingUp,
      title: "Categorías Premium",
      description: "Accede a categorías especiales según tu actividad",
    },
    {
      icon: Clock,
      title: "Historial Completo",
      description: "Revisa todas tus participaciones y estadísticas",
    },
  ];

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-gradient-to-br from-[#C9A063] to-[#6A4F99]">
      {/* Hero Section */}
      <section className="text-white px-4 w-full">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Bienvenido a HAMMER
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
              Participa en subastas exclusivas, vende tus artículos de valor y únete a una comunidad de coleccionistas y compradores exigentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auctions"
                className="px-8 py-4 bg-white text-[#6A4F99] rounded-lg hover:bg-gray-100 transition-colors text-center font-semibold text-lg"
              >
                Ver Subastas
              </Link>
              <Link
                to="/register"
                className="px-8 py-4 bg-[#6A4F99] text-white rounded-lg hover:bg-[#5A3F89] transition-colors text-center font-semibold border-2 border-white text-lg"
              >
                Registrarse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}