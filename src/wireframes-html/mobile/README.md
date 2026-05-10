# Wireframes Mobile - HAMMER Subastas

Wireframes mobile en escala de grises para la aplicación HAMMER - Sistema de Subastas.

## 📱 Archivos Disponibles

### Pantallas Principales

1. **home-mobile.html** - Página de Inicio
   - Header con logo y menú hamburguesa
   - Hero section con imagen y CTA
   - Features en formato vertical
   - Categorías de usuario (grid 2x2)
   - CTA final

2. **login-mobile.html** - Inicio de Sesión
   - Formulario de login
   - Alert de redirección (opcional)
   - Campos: Email y Contraseña
   - Checkbox "Recordarme" y link recuperar contraseña
   - Link para registrarse

3. **register-mobile.html** - Registro Paso 1
   - Indicador de progreso (Paso 1/2)
   - Formulario de datos personales
   - 7 campos en formato vertical
   - Botón "Continuar al Paso 2"

4. **register-step2-mobile.html** - Registro Paso 2
   - Indicador de progreso (Paso 2/2)
   - Upload de documentos (frente y dorso)
   - Áreas de drag & drop
   - Botones "Volver" y "Completar Registro"

5. **dashboard-mobile.html** - Panel de Usuario
   - Header con menú y badge de notificaciones
   - Badges de categoría y verificación
   - Stats en formato vertical
   - Subastas activas (cards verticales)
   - Pujas recientes (cards compactas)

6. **auctions-mobile.html** - Lista de Subastas
   - Filtros apilados (Buscar, Categoría, Moneda)
   - Cards de subastas en formato vertical
   - Badges de estado (EN VIVO/PRÓXIMA)
   - Información completa por card
   - Empty state (comentado)

7. **live-auction-mobile.html** - Subasta en Vivo
   - Badge "EN VIVO" con título de subasta
   - Item actual con imagen y timer
   - Sección de pujas (actual + botones rápidos)
   - Input de puja personalizada
   - Historial de pujas
   - Próximos lotes

### Pantallas Adicionales

8. **auction-detail-mobile.html** - Detalle de Subasta
   - Header con información de subasta
   - Badges de categoría y moneda
   - Descripción completa
   - Catálogo de items con imágenes
   - Botones de acción (ingresar/descargar catálogo)

9. **catalog-mobile.html** - Catálogo de Productos
   - Filtros por categoría y moneda
   - Búsqueda de productos
   - Grid de productos con imágenes
   - Información de precio y categoría
   - Bottom navigation

10. **complete-registration-mobile.html** - Completar Registro
    - Banner de éxito (documentos aprobados)
    - Formulario de contraseña
    - Datos de contacto y dirección
    - Upload de selfie con DNI
    - Requisitos de verificación

11. **forgot-password-mobile.html** - Recuperar Contraseña
    - Icono de seguridad
    - Formulario de recuperación
    - Información de expiración
    - Link para volver al login

12. **my-bids-mobile.html** - Mis Pujas
    - Estadísticas de pujas
    - Tabs (Activas/Finalizadas/Todas)
    - Cards de pujas con estados (Ganando/Superada/Ganada/Perdida)
    - Detalles de cada puja
    - Botones de acción por puja
    - Bottom navigation

13. **my-sales-mobile.html** - Mis Ventas
    - Estadísticas de ventas
    - Tabs (Activas/Pendientes/Finalizadas)
    - Cards de productos en venta
    - Estados (En Subasta/Revisión/Vendido/Rechazado)
    - Botón flotante para agregar
    - Bottom navigation

14. **notifications-mobile.html** - Notificaciones
    - Header con botón "marcar todo leído"
    - Filtros por tipo de notificación
    - Lista de notificaciones con íconos de color
    - Estados: leído/no leído
    - Botones de acción en notificaciones importantes
    - Bottom navigation

15. **payment-methods-mobile.html** - Medios de Pago
    - Banner informativo
    - Lista de tarjetas verificadas y pendientes
    - Estados de verificación
    - Botón para agregar nueva tarjeta
    - Requisitos de verificación
    - Bottom navigation

16. **profile-mobile.html** - Perfil de Usuario
    - Header con avatar y categoría
    - Grid de estadísticas (2x2)
    - Menú de opciones organizado por secciones
    - Badges de notificaciones
    - Botón de cerrar sesión
    - Bottom navigation

17. **submit-item-mobile.html** - Solicitar Venta
    - Header con guardar borrador
    - Formulario por secciones:
      - Información básica
      - Imágenes (upload + previews)
      - Precio y condiciones
      - Información adicional
    - Requisitos de fotos
    - Términos y condiciones

18. **stats-mobile.html** - Estadísticas
    - Header con gradiente
    - Tabs de filtros temporales
    - Grids de estadísticas (2x2)
    - Progreso de categoría con barra
    - Placeholders de gráficos
    - Listas de top compras y actividad reciente
    - Bottom navigation

## 🎨 Características de Diseño

- **Escala de Grises Completa**: Sin colores, solo tonos de gris (#000 a #fff)
- **Max-Width**: 414px (iPhone Pro Max)
- **Layout**: Una columna optimizada para mobile
- **Tipografía**: Arial, sans-serif
- **Placeholders**: Elementos grises (#999, #ccc, #ddd)
- **Sin imágenes reales**: Solo placeholders rectangulares

## 📐 Especificaciones Técnicas

### Espaciado
- Padding principal: 16-20px
- Gap entre elementos: 8-16px
- Margin entre secciones: 20-28px

### Componentes
- **Botones principales**: Full-width, padding 12-14px
- **Cards**: Border 1px #ddd, border-radius 8px
- **Inputs**: Padding 12px, con iconos a la izquierda (44px)
- **Badges**: Border-radius 12-16px, padding 4-6px

### Colores Principales
- Fondo: #f5f5f5
- Cards: #fff
- Texto primario: #333
- Texto secundario: #666
- Bordes: #ddd
- Elementos destacados: #999, #666
- Backgrounds oscuros: #666 (CTA, badges)

### Bottom Navigation
- Fijo en la parte inferior
- 4 items principales
- Iconos + labels
- Altura: ~60px + padding

## 🔍 Cómo Usar

1. Abrir cualquier archivo `.html` directamente en el navegador
2. Los wireframes son estáticos (HTML + CSS inline)
3. Responsive hasta 414px de ancho
4. Editar directamente el HTML para modificar

## ✅ Estados Representados

- **Badges de estado**: EN VIVO (#666), PRÓXIMA (#999), Verificado, Pendiente
- **Pujas**: Ganando (verde), Superado (rojo), Ganada (azul), Perdida (gris)
- **Notificaciones**: Leído/No leído, con íconos de color
- **Pagos**: Verificada (verde), En Revisión (amarillo)
- **Ventas**: Activa, Pendiente, Vendido, Rechazado

## 📝 Notas

- Todos los wireframes coinciden exactamente con las pantallas reales de la app
- Los elementos interactivos están representados con placeholders
- Las áreas de contenido dinámico usan elementos repetidos para mostrar la estructura
- Los comentarios HTML indican estados alternativos (ej. empty states, file previews)
- Los wireframes incluyen bottom navigation para facilitar la navegación entre pantallas
- Se utilizan colores semánticos en algunos elementos (verde=éxito, rojo=error, amarillo=advertencia, azul=info)
