import { Link, useNavigate } from "react-router";
import { User, Mail, MapPin, FileText, Upload, X } from "lucide-react";
import { useState } from "react";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [documentFront, setDocumentFront] = useState<File | null>(null);
  const [documentBack, setDocumentBack] = useState<File | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mostrar modal de confirmación antes de enviar
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    // Redirigir a la página de validación de email
    navigate("/email-validation");
  };

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center px-4 py-6 bg-gray-50">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Crear Cuenta</h1>
          <p className="text-sm text-[#A08C79]">Completa tus datos para registrarte</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-3">
                {/* Nombre y Apellido en una línea */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="firstName" className="block mb-1 text-sm text-[#333F48]">
                      Nombre
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={18} />
                      <input
                        id="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Juan"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block mb-1 text-sm text-[#333F48]">
                      Apellido
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={18} />
                      <input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Pérez"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block mb-1 text-sm text-[#333F48]">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={18} />
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="tu@email.com"
                      required
                    />
                  </div>
                </div>

                {/* Domicilio y País en una línea */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="address" className="block mb-1 text-sm text-[#333F48]">
                      Domicilio Legal
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={18} />
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => updateFormData("address", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Calle, número, ciudad"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block mb-1 text-sm text-[#333F48]">
                      País de Origen
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A08C79]" size={18} />
                      <select
                        id="country"
                        value={formData.country}
                        onChange={(e) => updateFormData("country", e.target.value)}
                        className="w-full pl-10 pr-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Seleccionar país</option>
                        <option value="AR">Argentina</option>
                        <option value="BR">Brasil</option>
                        <option value="CL">Chile</option>
                        <option value="CO">Colombia</option>
                        <option value="MX">México</option>
                        <option value="UY">Uruguay</option>
                        <option value="US">Estados Unidos</option>
                        <option value="ES">España</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Documentos en una línea compacta */}
                <div>
                  <label className="block mb-1 text-sm text-[#333F48]">
                    Foto del Documento (Frente y Dorso)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Frente */}
                    <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="text-[#A08C79] flex-shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        {documentFront ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-[#333F48] font-medium truncate">{documentFront.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setDocumentFront(null);
                              }}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-[#A08C79]">Frente DNI</p>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setDocumentFront(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>

                    {/* Dorso */}
                    <label className="flex items-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="text-[#A08C79] flex-shrink-0" size={20} />
                      <div className="flex-1 min-w-0">
                        {documentBack ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-[#333F48] font-medium truncate">{documentBack.name}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                setDocumentBack(null);
                              }}
                              className="text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-[#A08C79]">Dorso DNI</p>
                        )}
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setDocumentBack(e.target.files ? e.target.files[0] : null)}
                      />
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Crear Cuenta
                </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-[#A08C79]">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>

        {/* Modal de Confirmación */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-[#333F48] mb-4">
                Confirmar Envío de Datos
              </h2>
              <p className="text-sm text-[#A08C79] mb-6">
                ¿Estás seguro de que deseas enviar estos datos? Una vez enviados, <strong>no podrás modificarlos</strong>.
                Por favor, revisa que toda la información sea correcta antes de continuar.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Volver a Revisar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSubmit}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Confirmar Envío
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
