import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiPost } from '@/app/lib/api';

interface UserSession {
  id: number;
  name: string;
  email: string;
  category: "comun" | "especial" | "plata" | "oro" | "platino";
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ mustChangePassword?: boolean; email?: string } | void>;
  logout: () => Promise<void>;
  showSplash: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsReady(true);
      }
    };
    
    loadUser();

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    const resp = await apiPost('/auth/login', { email, password });
    
    // CASO 1: Primer inicio de sesión detectado por el backend
    if (resp && resp.mustChangePassword) {
      // Retornamos la respuesta completa para que el componente Login sepa que debe redirigir
      return { 
        mustChangePassword: true, 
        email: resp.email 
      };
    }

    // CASO 2: Login común y corriente exitoso
    const target = resp.data ? resp.data : resp;
    const { user: loggedUser, token: loggedToken } = target;

    if (!loggedUser || !loggedToken) {
      throw new Error("La respuesta del servidor no es válida.");
    }

    setUser(loggedUser);
    setToken(loggedToken);
    
    await AsyncStorage.setItem('user', JSON.stringify(loggedUser));
    await AsyncStorage.setItem('token', loggedToken);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
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