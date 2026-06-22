import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiGet } from '@/app/lib/api';

interface NotificationContextType {
  unreadCount: number;
  refreshCount: (token: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  refreshCount: async () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshCount = useCallback(async (token: string) => {
    try {
      const data = await apiGet('/notificaciones', token);
      const lista = Array.isArray(data) ? data : [];
      setUnreadCount(lista.filter((n: any) => !n.leido).length);
    } catch {
      // silencioso
    }
  }, []);

  return (
    <NotificationContext.Provider value={{ unreadCount, refreshCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationBadge = () => useContext(NotificationContext);
