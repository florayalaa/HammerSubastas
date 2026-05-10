import { Upload, X, CheckCircle, Info, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function SellItem() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    agreedToTerms: false,
    // Paso 2 - Campos opcionales
    artistOrDesigner: "",
    date: "",
    history: "",
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [showInfoBanner, setShowInfoBanner] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length < 6) {
      alert("Debes subir al menos 6 imágenes del artículo");
      return;
    }
    if (!formData.agreedToTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    // Ir al paso 2
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mostrar modal de confirmación
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    setSubmitted(true);
  };

  const handleImageUpload = () => {
    // Mock image upload
    if (uploadedImages.length < 10) {
      setUploadedImages([...uploadedImages, `image-${uploadedImages.length + 1}.jpg`]);
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    if (currentImageIndex >= uploadedImages.length - 1 && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const nextImage = () => {
    if (currentImageIndex < uploadedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8 border border-gray-200 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-600" size={48} />
          </div>
          <h1 className="text-3xl font-bold text-[#333F48] mb-4">
            ¡Solicitud Enviada con Éxito!
          </h1>
          <p className="text-[#A08C79] mb-6">
            Tu artículo ha sido enviado para revisión. Nuestro equipo de expertos evaluará tu solicitud y te contactaremos dentro de las próximas 48-72 horas.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-[#333F48] mb-2">Próximos Pasos:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-[#A08C79]">
              <li>Revisión inicial de tu solicitud (24-48 horas)</li>
              <li>Si es aceptado, te enviaremos la dirección de envío</li>
              <li>Inspección física del artículo</li>
              <li>Notificación de aceptación final, categoría, estado y valor base determinado por nuestros expertos</li>
              <li>Inclusión en una próxima subasta</li>
            </ol>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFormData({
                title: "",
                description: "",
                agreedToTerms: false,
                artistOrDesigner: "",
                date: "",
                history: "",
              });
              setUploadedImages([]);
              setCurrentImageIndex(0);
            }}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Enviar Otro Artículo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-6 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-[#333F48] mb-1">Vender un Artículo</h1>
          <p className="text-sm text-[#A08C79]">
            Completa el formulario para solicitar incluir tu artículo en una futura subasta
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>
                1
              </div>
              <span className="ml-2 text-sm text-[#333F48]">Información Básica</span>
            </div>
            <div className={`h-1 w-12 ${step >= 2 ? 'bg-primary' : 'bg-gray-300'}`} />
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'}`}>
                2
              </div>
              <span className="ml-2 text-sm text-[#333F48]">Información Adicional</span>
            </div>
          </div>
        </div>

        {/* Info Banner - Desplegable oculto por defecto */}
        <div className="mb-4">
          <button
            onClick={() => setShowInfoBanner(!showInfoBanner)}
            className="w-full flex items-center justify-between p-3 bg-[#C9A063]/20 border border-[#C9A063] rounded-lg hover:bg-[#C9A063]/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Info className="text-[#C9A063]" size={18} />
              <span className="font-semibold text-[#333F48] text-sm">Información Importante</span>
            </div>
            {showInfoBanner ? <ChevronUp size={18} className="text-[#C9A063]" /> : <ChevronDown size={18} className="text-[#C9A063]" />}
          </button>

          {showInfoBanner && (
            <div className="bg-[#C9A063]/20 border border-[#C9A063] border-t-0 rounded-b-lg p-3 -mt-1">
              <ul className="list-disc list-inside space-y-1 text-xs text-[#A08C79]">
                <li>Debes subir al menos 6 imágenes de alta calidad del artículo</li>
                <li>El artículo debe ser de tu propiedad y sin impedimentos legales</li>
                <li>Los costos de envío para inspección corren por tu cuenta</li>
                <li>Si el artículo es rechazado, la devolución también tiene cargo</li>
                <li>La categoría, estado del artículo y valor estimado serán determinados por nuestros expertos</li>
              </ul>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              {/* Paso 1: Información Básica */}
              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Título del Artículo *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Reloj Omega Speedmaster Vintage"
                  required
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Descripción Detallada *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Describe el artículo con el mayor detalle posible..."
                  required
                />
              </div>

              {/* Imágenes - Mini Carrusel */}
              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Imágenes del Artículo * <span className="text-xs text-[#A08C79]">(mínimo 6, máximo 10)</span>
                </label>

                {uploadedImages.length > 0 && (
                  <div className="mb-3">
                    {/* Carrusel - Tamaño reducido */}
                    <div className="relative bg-gray-100 rounded-lg h-32 flex items-center justify-center mb-2">
                      <div className="text-[#A08C79] text-sm">
                        Imagen {currentImageIndex + 1}: {uploadedImages[currentImageIndex]}
                      </div>

                      {/* Controles del carrusel */}
                      {uploadedImages.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={prevImage}
                            disabled={currentImageIndex === 0}
                            className="absolute left-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronLeft size={20} />
                          </button>
                          <button
                            type="button"
                            onClick={nextImage}
                            disabled={currentImageIndex === uploadedImages.length - 1}
                            className="absolute right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRight size={20} />
                          </button>
                        </>
                      )}

                      {/* Botón eliminar */}
                      <button
                        type="button"
                        onClick={() => removeImage(currentImageIndex)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Indicadores */}
                    <div className="flex justify-center gap-1.5">
                      {uploadedImages.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === currentImageIndex ? 'bg-primary' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Botón de subir - más pequeño */}
                {uploadedImages.length < 10 && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-3 text-center hover:border-primary transition-colors"
                  >
                    <Upload className="mx-auto mb-1 text-[#A08C79]" size={20} />
                    <p className="text-xs text-[#A08C79]">
                      Subir imagen ({uploadedImages.length}/10)
                    </p>
                  </button>
                )}
              </div>

              {/* Terms - Simplificado */}
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={(e) => updateFormData("agreedToTerms", e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
                    required
                  />
                  <span className="text-xs text-[#333F48]">
                    Estoy de acuerdo con los{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="text-primary hover:underline font-semibold"
                    >
                      términos y condiciones
                    </button>
                  </span>
                </label>
              </div>

              {/* Botón Continuar */}
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleStep2Submit} className="space-y-4">
              {/* Paso 2: Información Adicional (Opcional) */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <p className="text-xs text-blue-800">
                  <strong>Opcional:</strong> Esta información puede ayudar a nuestros expertos a evaluar mejor tu artículo, pero no es obligatoria.
                </p>
              </div>

              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Nombre del Artista o Diseñador
                </label>
                <input
                  type="text"
                  value={formData.artistOrDesigner}
                  onChange={(e) => updateFormData("artistOrDesigner", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Pablo Picasso, Charles Eames..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Fecha o Época
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => updateFormData("date", e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 1960, Siglo XVIII, Art Déco..."
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-[#333F48]">
                  Historia del Objeto
                </label>
                <textarea
                  value={formData.history}
                  onChange={(e) => updateFormData("history", e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm bg-input-background border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="Contexto, dueños anteriores, curiosidades, etc."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-gray-200 text-[#333F48] rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                >
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  Enviar Solicitud
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Modal de Términos y Condiciones */}
      {showTermsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#333F48]">Términos y Condiciones</h2>
                <button
                  onClick={() => setShowTermsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="space-y-4 text-sm text-[#333F48]">
                <div>
                  <h3 className="font-semibold mb-2">1. Propiedad del Artículo</h3>
                  <p className="text-[#A08C79]">
                    Declaro que el artículo presentado es de mi propiedad y no posee ningún impedimento legal para su venta. Tengo todos los derechos necesarios para ofrecer este artículo en subasta.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">2. Costos de Envío e Inspección</h3>
                  <p className="text-[#A08C79]">
                    Acepto que los costos de envío del artículo a las instalaciones de HAMMER para su inspección corren por mi cuenta. Estos costos no son reembolsables.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">3. Rechazo del Artículo</h3>
                  <p className="text-[#A08C79]">
                    En caso de que el artículo sea rechazado por HAMMER, acepto que los costos de devolución del mismo también serán de mi responsabilidad. HAMMER me informará las razones del rechazo a través de la aplicación.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">4. Verificación de Origen Lícito</h3>
                  <p className="text-[#A08C79]">
                    Acepto que puedo ser contactado por las autoridades competentes si existen dudas sobre el origen lícito del bien. HAMMER se reserva el derecho de notificar a las autoridades en caso de sospechas fundadas.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">5. Categorización y Valoración</h3>
                  <p className="text-[#A08C79]">
                    Entiendo y acepto que la categoría del artículo, su estado y el valor base de subasta serán determinados exclusivamente por los expertos de HAMMER. Estas determinaciones son finales y no están sujetas a negociación.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">6. Comisiones</h3>
                  <p className="text-[#A08C79]">
                    Acepto que HAMMER cobrará una comisión sobre el precio de venta del artículo. El porcentaje de comisión será informado antes de la aceptación final del artículo en subasta.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">7. Seguro</h3>
                  <p className="text-[#A08C79]">
                    HAMMER contratará un seguro para el artículo basado en el valor base determinado. Como propietario, puedo aumentar la cobertura del seguro contactando directamente con la compañía aseguradora.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">8. Veracidad de la Información</h3>
                  <p className="text-[#A08C79]">
                    Declaro que toda la información proporcionada en este formulario es veraz y completa. Cualquier falsedad puede resultar en el rechazo del artículo y la prohibición de participar en futuras subastas de HAMMER.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-[#333F48] mb-4">
              Confirmar Envío de Solicitud
            </h2>
            <p className="text-sm text-[#A08C79] mb-6">
              ¿Estás seguro de que deseas enviar esta solicitud? Por favor, verifica que toda la información y las imágenes sean correctas antes de continuar.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <p className="text-xs text-yellow-800">
                <strong>Importante:</strong> Una vez enviada, la solicitud será revisada por nuestros expertos. Te contactaremos en 24-48 horas con una respuesta.
              </p>
            </div>
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
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
