import { Outlet, useLocation } from "react-router";
import { Header } from "../components/Header";
import { BottomNav } from "../components/BottomNav";
import { Footer } from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

export function Root() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const showBottomNav = isAuthenticated && !["/login", "/register", "/"].includes(location.pathname);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${showBottomNav ? "pb-16 md:pb-0" : ""}`}>
        <Outlet />
      </main>
      {showBottomNav && (
        <div className="md:hidden">
          <BottomNav />
        </div>
      )}
      <Footer />
    </div>
  );
}