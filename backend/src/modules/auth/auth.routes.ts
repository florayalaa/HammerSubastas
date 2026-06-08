import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema, completeRegistrationSchema, approvePostorSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.schema';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/complete-registration', validateRequest(completeRegistrationSchema), authController.completeRegistration);
router.post('/login', validateRequest(loginSchema), authController.login);

router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validateRequest(resetPasswordSchema), authController.resetPassword);

// Ruta Exclusiva de Simulación Manual (Back-office / Postman)
router.post('/admin/approve', validateRequest(approvePostorSchema), authController.approvePostor);

export default router;
