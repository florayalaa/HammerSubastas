import { Link } from "react-router";
import { Home, Search } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="text-9xl font-bold text-[#6A4F99] mb-4">404</div>
          <h1 className="text-3xl font-bold text-[#333F48] mb-4">Página no encontrada</h1>
          <p className="text-[#A08C79] mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Home size={20} />
            Volver al Inicio
          </Link>
          <Link
            to="/auctions"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Search size={20} />
            Ver Subastas
          </Link>
        </div>
      </div>
    </div>
  );
}
