# Wireframes - HAMMER Subastas

Esta carpeta contiene 5 wireframes en blanco y negro para las principales páginas de la aplicación de subastas.

## Wireframes Incluidos

1. **HomeWireframe** - Página de inicio/landing
   - Hero section con call-to-action
   - Grid de categorías
   - Sección "Cómo funciona"
   - Footer

2. **LoginWireframe** - Página de inicio de sesión
   - Formulario de login
   - Campos de email y contraseña
   - Opción de recordar usuario
   - Link de registro

3. **DashboardWireframe** - Panel de control del usuario
   - Tarjetas de estadísticas
   - Subastas activas
   - Actividad reciente
   - Subastas próximas
   - Navegación inferior (móvil)

4. **AuctionsWireframe** - Listado de subastas
   - Filtros laterales (categorías, precio, estado)
   - Grid/lista de subastas
   - Opciones de ordenamiento
   - Paginación

5. **LiveAuctionWireframe** - Subasta en vivo
   - Información del producto
   - Display de puja actual
   - Formulario de puja con slider
   - Botones de puja rápida

## Paleta de Colores

Los wireframes utilizan únicamente escala de grises:
- **Negro (#000)** - Elementos principales, títulos, bordes
- **Gris oscuro (#333, #666)** - Texto secundario
- **Gris medio (#999, #ccc)** - Elementos deshabilitados, placeholders
- **Gris claro (#eee)** - Fondos secundarios
- **Blanco (#fff)** - Fondo principal

## Uso

Para visualizar un wireframe, impórtalo en tu aplicación:

```tsx
import { HomeWireframe } from './wireframes';

function App() {
  return <HomeWireframe />;
}
```

O visualiza todos a la vez:

```tsx
import {
  HomeWireframe,
  LoginWireframe,
  DashboardWireframe,
  AuctionsWireframe,
  LiveAuctionWireframe
} from './wireframes';
```

## Características

- ✅ Diseño responsive (mobile-first)
- ✅ Solo blanco y negro
- ✅ Estructura clara y minimalista
- ✅ Componentes reutilizables
- ✅ Compatibles con Tailwind CSS

## Notas

Estos wireframes son esquemas visuales de baja fidelidad diseñados para:
- Planificar la estructura de las páginas
- Definir la jerarquía de contenido
- Establecer el flujo de usuario
- Facilitar la comunicación del diseño

No incluyen colores finales, tipografías específicas ni contenido real.
