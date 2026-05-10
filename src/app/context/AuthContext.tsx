import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category: "Común" | "Especial" | "Plata" | "Oro" | "Platino";
  verified: boolean;
  hasPaymentMethods: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
  showSplash: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Check if user is already logged in (from localStorage)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Show splash screen for 5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const login = (email: string, password: string) => {
    // Mock login - in real app would authenticate with backend
    const mockUser: User = {
      id: 1,
      firstName: "Juan",
      lastName: "Pérez",
      email: email,
      category: "Oro",
      verified: true,
      hasPaymentMethods: true,
    };
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        showSplash,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
