import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock: Simular envío de email
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#333F48] mb-2">
                Correo Enviado
              </h1>
              <p className="text-[#A08C79]">
                Si el correo {email} está registrado en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
              </p>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-[#A08C79] text-center">
                Por favor revisa tu bandeja de entrada y tu carpeta de spam.
              </p>
              
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            <ArrowLeft size={20} />
            Volver
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-600 mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-[#A08C79]">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-2 text-[#333F48]">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={20} />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Enviar enlace de recuperación
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#A08C79]">
              ¿Recordaste tu contraseña?{" "}
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
