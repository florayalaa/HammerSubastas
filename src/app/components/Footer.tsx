import { useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Misma lógica que Root.tsx para determinar si se muestra BottomNav
  const showBottomNav = isAuthenticated && !["/login", "/register", "/", "/complete-registration", "/forgot-password"].includes(location.pathname);

  return (
    <footer className={`bg-[#333F48] text-white py-6 mt-auto ${showBottomNav ? 'mb-16 md:mb-0' : ''}`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p className="text-sm opacity-90">
            © {currentYear} HAMMER - Subastas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
