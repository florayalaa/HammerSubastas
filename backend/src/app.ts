import express, { Request, Response } from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { prisma } from './configuracion/baseDatos';
import autenticacionRoutes from './modulos/autenticacion/autenticacion.routes';
import usuariosRoutes from './modulos/usuarios/usuarios.routes';
import subastasRoutes from './modulos/subastas/subastas.routes';
import pujosRoutes from './modulos/pujos/pujos.routes';
import paisesRoutes from './modulos/paises/paises.routes';
import { articulosRoutes } from './modulos/articulos/articulos.routes';
import { pagosRoutes } from './modulos/pagos/pagos.routes';
import { notificacionesRoutes } from './modulos/notificaciones/notificaciones.routes';

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

const RANGO_CATEGORIA: Record<string, number> = {
  comun: 1, especial: 2, plata: 3, oro: 4, platino: 5,
};

function categoriasPermitidasApp(userCategory: string | undefined): string[] | null {
  if (!userCategory) return null;
  const rango = RANGO_CATEGORIA[userCategory.toLowerCase()] ?? 1;
  return Object.entries(RANGO_CATEGORIA)
    .filter(([, r]) => r <= rango)
    .map(([cat]) => cat);
}

function getUserCategoryFromReq(req: Request): string | undefined {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return undefined;
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET) as any;
    return decoded.category;
  } catch {
    return undefined;
  }
}

const ETIQUETAS_MONEDA: Record<string, { nombre: string; simbolo: string }> = {
  pesos: { nombre: 'ARS (Pesos)',    simbolo: '$'   },
  USD:   { nombre: 'USD (Dólares)', simbolo: 'U$S' },
};

const CATEGORIAS_ARTICULO = [
  { valor: 'Arte',                   ejemplos: 'pinturas, esculturas, fotografías artísticas' },
  { valor: 'Joyería',                ejemplos: 'anillos, collares, pulseras, relojes de lujo' },
  { valor: 'Antigüedades',           ejemplos: 'muebles, porcelanas, objetos de época' },
  { valor: 'Numismática',            ejemplos: 'monedas y billetes de colección' },
  { valor: 'Filatelia',              ejemplos: 'estampillas y sellos postales' },
  { valor: 'Vinos y Spirits',        ejemplos: 'botellas de colección, añadas especiales' },
  { valor: 'Libros y Manuscritos',   ejemplos: 'primeras ediciones, documentos históricos' },
  { valor: 'Instrumentos Musicales', ejemplos: 'violines, guitarras históricas' },
  { valor: 'Tecnología Vintage',     ejemplos: 'cámaras, radios, consolas antiguas' },
  { valor: 'Otros',                  ejemplos: 'cualquier bien que no encaje en las anteriores' },
];

app.get('/api/monedas', async (req: Request, res: Response) => {
  try {
    const permitidas = categoriasPermitidasApp(getUserCategoryFromReq(req));
    const rows: Array<{ moneda: string | null }> = await (prisma as any).extra_subastas.findMany({
      where: permitidas ? { subastas: { categoria: { in: permitidas } } } : undefined,
      select: { moneda: true },
    });
    const codigos = [...new Set(rows.map((r) => r.moneda ?? 'pesos'))];
    const monedas = codigos.map((codigo) => {
      const etiqueta = ETIQUETAS_MONEDA[codigo];
      return { codigo, nombre: etiqueta?.nombre ?? codigo, simbolo: etiqueta?.simbolo ?? codigo };
    });
    res.json(monedas);
  } catch (err) {
    console.error('[monedas] error:', err);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
});

app.get('/api/categorias-articulo', (_req, res) => res.json(CATEGORIAS_ARTICULO));

app.use('/api/paises', paisesRoutes);
app.use('/api/autenticacion', autenticacionRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/subastas', subastasRoutes);
app.use('/api/pujos', pujosRoutes);
app.use('/api/articulos', articulosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/notificaciones', notificacionesRoutes);

export default app;
