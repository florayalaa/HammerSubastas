import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showSplash: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsReady(true);
      }
    };
    
    loadUser();

    // Show splash screen for 3 seconds instead of 5 for mobile
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login
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
    await AsyncStorage.setItem("user", JSON.stringify(mockUser));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        showSplash,
        isReady
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
