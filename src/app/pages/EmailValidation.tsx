import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export function EmailValidation() {
  const navigate = useNavigate();
  const [validationCode, setValidationCode] = useState("");
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (validationCode.length !== 6) {
      setError("El código debe tener 6 dígitos");
      return;
    }

    setIsValidating(true);

    // Simular validación
    setTimeout(() => {
      // En producción, aquí se validaría el código con el backend
      if (validationCode === "123456" || validationCode.length === 6) {
        // Código válido - redirigir a login
        navigate("/login", {
          state: { message: "¡Tu cuenta ha sido verificada exitosamente! Ya puedes iniciar sesión." }
        });
      } else {
        setError("Código incorrecto. Por favor, verifica e intenta nuevamente.");
        setIsValidating(false);
      }
    }, 1500);
  };

  const handleResendCode = () => {
    alert("Se ha enviado un nuevo código de validación a tu correo electrónico.");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Mail className="text-blue-600" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">
            Validación de Email
          </h1>
          <p className="text-[#A08C79]">
            Hemos enviado un código de 6 dígitos a tu correo electrónico
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="code" className="block mb-2 text-sm font-semibold text-[#333F48]">
                Código de Validación
              </label>
              <input
                id="code"
                type="text"
                value={validationCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                  setValidationCode(value);
                  setError("");
                }}
                className="w-full px-4 py-3 text-center text-2xl tracking-widest bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-xs text-[#A08C79] mt-2 text-center">
                Ingresa el código de 6 dígitos que recibiste por email
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isValidating || validationCode.length !== 6}
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validando...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Validar Código
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-[#A08C79] mb-3">
                ¿No recibiste el código?
              </p>
              <button
                onClick={handleResendCode}
                className="text-sm text-primary hover:underline font-semibold"
              >
                Reenviar código de validación
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/login"
              className="text-sm text-[#A08C79] hover:text-[#333F48] transition-colors"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-[#333F48] mb-2 text-sm">
            Consejos de Seguridad:
          </h3>
          <ul className="text-xs text-blue-900 space-y-1">
            <li>• Nunca compartas tu código de validación con nadie</li>
            <li>• El código expira en 15 minutos</li>
            <li>• Si no encuentras el email, revisa tu carpeta de spam</li>
            <li>• El correo fue enviado desde noreply@hammer-auctions.com</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
