import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const result = await authService.register(req.body);
      res.status(201).json(result);
    } catch (error: any) {
      console.error("[REGISTER ERROR]:", error);
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(401).json({ status: 'error', message: error.message });
    }
  }

  async completeRegistration(req: Request, res: Response) {
    try {
      const result = await authService.completeRegistration(req.body);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async approvePostor(req: Request, res: Response) {
    try {
      const result = await authService.approvePostor(req.body);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const result = await authService.requestPasswordReset(req.body.email);
      return res.status(200).json({ status: 'success', message: result.message });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const result = await authService.resetPassword(req.body);
      return res.status(200).json({ status: 'success', data: result });
    } catch (error: any) {
      return res.status(400).json({ status: 'error', message: error.message });
    }
  }
}

export const authController = new AuthController();
