import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { apiGet, apiPost, registrarManejadorSesionExpirada } from '@/app/lib/api';

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
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  showSplash: boolean;
  isReady: boolean;
  pendingEmail: string | null;
  clearPendingEmail: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await SecureStore.getItemAsync("token");
        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedToken) setToken(storedToken);
      } catch (e) {
        console.error("Failed to load user", e);
      } finally {
        setIsReady(true);
      }
    };

    loadUser();

    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const resp = await apiPost('/autenticacion/login', { email, password });
      const { user: respUser, token: respToken } = resp;
      setUser(respUser);
      setToken(respToken);
      await AsyncStorage.setItem('user', JSON.stringify(respUser));
      if (respToken) await SecureStore.setItemAsync('token', respToken);
    } catch (error: any) {
      if (error.message?.includes('completar el registro')) {
        setPendingEmail(email);
      }
      throw error;
    }
  };

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setPendingEmail(null);
    await AsyncStorage.removeItem('user');
    await SecureStore.deleteItemAsync('token');
  }, []);

  useEffect(() => {
    registrarManejadorSesionExpirada(logout);
  }, [logout]);

  useEffect(() => {
    if (!token) return;
    const intervalo = setInterval(async () => {
      try {
        await apiGet('/usuarios/yo', token);
      } catch {
        // el manejadorSesionExpirada se encarga del 401
      }
    }, 30000);
    return () => clearInterval(intervalo);
  }, [token]);

  const clearPendingEmail = () => setPendingEmail(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        showSplash,
        isReady,
        pendingEmail,
        clearPendingEmail,
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
