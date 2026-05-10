import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { SplashScreen } from "./components/SplashScreen";

function AppContent() {
  const { showSplash } = useAuth();

  if (showSplash) {
    return <SplashScreen />;
  }

  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </AuthProvider>
  );
}