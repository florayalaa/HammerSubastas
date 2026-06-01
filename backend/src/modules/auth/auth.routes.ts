import { Router } from 'express';
import { authController } from './auth.controller';
import { validateRequest } from '../../middlewares/validateRequest';
import { registerSchema, loginSchema, forgotPasswordSchema, completeRegistrationSchema } from './auth.schema';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/complete-registration', validateRequest(completeRegistrationSchema), authController.completeRegistration);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/forgot-password', validateRequest(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/refresh-token', authController.refreshToken);

export default router;
