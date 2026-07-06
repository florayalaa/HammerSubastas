import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../configuracion/baseDatos';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    category: string;
  };
}

export const optionalAuth = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET || 'super_secret_jwt_key_12345') as any;
    req.user = { id: decoded.id, email: decoded.email, category: decoded.category };
  } catch { /* token inválido: continuar sin usuario */ }
  next();
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ status: 'error', message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_jwt_key_12345') as any;

    const persona = await prisma.personas.findUnique({
      where: { identificador: parseInt(decoded.id) },
      select: { estado: true, clientes: { select: { categoria: true } } },
    });

    if (!persona) {
      return res.status(401).json({ status: 'error', message: 'Sesión inválida' });
    }
    if (persona.estado === 'inactivo') {
      return res.status(401).json({ status: 'error', message: 'Cuenta desactivada. Contactate con soporte en subastas.hammer@gmail.com' });
    }

    // Si la categoría del cliente cambió desde que se generó el token (ej: editada a mano
    // en la base), forzamos a cerrar sesión en vez de dejar al usuario con datos desactualizados.
    const categoriaActual = persona.clientes?.categoria ?? null;
    if (categoriaActual && categoriaActual !== decoded.category) {
      return res.status(401).json({ status: 'error', message: 'Tu cuenta cambió de categoría. Volvé a iniciar sesión.' });
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      category: decoded.category,
    };
    next();
  } catch (error) {
    return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
  }
};
