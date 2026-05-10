import { Link, useNavigate } from "react-router";
import { Lock, CheckCircle } from "lucide-react";
import { useState } from "react";

export function CompleteRegistration() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock: Información del usuario aprobado (vendría del token del email)
  const userInfo = {
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    category: "Común",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 8) {
      alert("La contraseña debe tener al menos 8 caracteres");
      return;
    }

    // Mock: Guardar contraseña y completar registro
    setSubmitted(true);
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-2xl font-bold text-[#333F48] mb-4">
            ¡Registro Completado!
          </h1>
          <p className="text-[#A08C79] mb-6">
            Tu cuenta ha sido creada exitosamente. Serás redirigido al inicio de sesión en unos segundos.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Ir al Inicio de Sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-600 mb-2">Completar Registro</h1>
          <p className="text-sm text-[#A08C79]">¡Tu solicitud ha sido aprobada!</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          {/* Info del usuario aprobado */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-[#333F48] mb-2">Bienvenido, {userInfo.firstName}!</h3>
            <div className="text-sm text-[#A08C79] space-y-1">
              <p><strong>Email:</strong> {userInfo.email}</p>
              <p><strong>Categoría asignada:</strong> {userInfo.category}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block mb-2 text-sm text-[#333F48]">
                Crear Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-sm text-[#333F48]">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Confirma tu contraseña"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Requisitos de contraseña:</strong>
              </p>
              <ul className="text-xs text-blue-800 list-disc list-inside mt-1">
                <li>Mínimo 8 caracteres</li>
                <li>Se recomienda incluir mayúsculas, números y símbolos</li>
              </ul>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Crear Cuenta
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#A08C79]">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
