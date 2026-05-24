import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      // Por el momento, es solo un mock
      res.json({ message: `Se ha enviado un enlace de recuperación a ${req.body.email}` });
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Contraseña actualizada (Mock)' });
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    res.json({ message: 'Token renovado (Mock)' });
  }
}

export const authController = new AuthController();
