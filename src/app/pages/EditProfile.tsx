import { Link, useNavigate } from "react-router";
import { ChevronLeft, User, Mail, MapPin, Globe, Save } from "lucide-react";
import { useState } from "react";

export function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+54 11 1234-5678",
    country: "Argentina",
    address: "Av. Corrientes 1234, CABA",
    city: "Buenos Aires",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de actualización
    alert("Perfil actualizado exitosamente");
    navigate("/profile");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 mb-4 text-[#A08C79] hover:text-[#333F48] transition-colors"
          >
            <ChevronLeft size={20} />
            Volver al Perfil
          </Link>
          <h1 className="text-3xl font-bold text-[#333F48] mb-2">Editar Perfil</h1>
          <p className="text-[#A08C79]">Actualiza tu información personal</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          {/* Información Personal */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#333F48] mb-4 flex items-center gap-2">
              <User size={20} className="text-primary" />
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Nombre
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Apellido
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#333F48] mb-4 flex items-center gap-2">
              <Mail size={20} className="text-primary" />
              Contacto
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-[#A08C79]">
                  Este email se usa para notificaciones importantes
                </p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#333F48] mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-primary" />
              Ubicación
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  País
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                >
                  <option value="Argentina">Argentina</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Chile">Chile</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Paraguay">Paraguay</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-[#333F48]">
                  Dirección
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Nota informativa */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>Nota:</strong> Los cambios en tu email o país pueden requerir verificación adicional.
              Recibirás un correo de confirmación en caso de ser necesario.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex-1 px-6 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
            >
              <Save size={20} />
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
