import { Link, useLocation, useNavigate } from "react-router";
import { Logo } from "./Logo";
import { Menu, X, LogOut, LayoutDashboard, Gavel, ShoppingBag, Tag, Package, Bell } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const isLoggedIn = isAuthenticated;

  const navigation = isLoggedIn
    ? [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { name: "Subastas", href: "/auctions", icon: Gavel },
        { name: "Mis Compras", href: "/my-purchases", icon: ShoppingBag },
        { name: "Mis Ventas", href: "/my-sales", icon: Package },
        { name: "Vender", href: "/sell-item", icon: Tag },
      ]
    : [];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to={isLoggedIn ? "/dashboard" : "/"}>
            <Logo size="sm" />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:gap-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.href
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            {isLoggedIn && (
              <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                <Link
                  to="/notifications"
                  className={`flex items-center gap-2 px-3 py-2 rounded-md relative transition-colors ${
                    location.pathname === "/notifications"
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-primary/10"
                  }`}
                >
                  <Bell size={18} />
                  <span>Notificaciones</span>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#C9A063] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-foreground hover:bg-destructive/10 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
            {!isLoggedIn && (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-md text-foreground hover:bg-primary/10 transition-colors"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button - Solo mostrar cuando está logueado */}
          {isLoggedIn && (
            <button
              type="button"
              className="md:hidden p-2 rounded-md text-foreground hover:bg-primary/10 relative"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              {/* Badge de notificaciones sin leer */}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C9A063] w-3 h-3 rounded-full border-2 border-white"></span>
              )}
            </button>
          )}

          {/* Login/Register buttons for mobile when not logged in */}
          {!isLoggedIn && (
            <div className="md:hidden flex items-center gap-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm rounded-md text-foreground hover:bg-primary/10 transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-sm rounded-md bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Registrarse
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu - Solo cuando está logueado */}
        {mobileMenuOpen && isLoggedIn && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <Link
              to="/notifications"
              className="flex items-center gap-2 px-4 py-2 rounded-md text-foreground hover:bg-primary/10 w-full text-left relative mb-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Bell size={18} />
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <span className="ml-auto bg-[#C9A063] text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-md text-foreground hover:bg-destructive/10 w-full text-left"
            >
              <LogOut size={18} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}