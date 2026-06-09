import { Router } from 'express';
import multer from 'multer';
import { authController } from './autenticacion.controller';
import { validateRequest } from '../../middlewares/validarSolicitud';
import { registerSchema, loginSchema, completeRegistrationSchema } from './autenticacion.schema';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/registrar', upload.fields([{ name: 'fotoFrente', maxCount: 1 }, { name: 'fotoDorso', maxCount: 1 }]), validateRequest(registerSchema), authController.register);
router.post('/completar-registro', validateRequest(completeRegistrationSchema), authController.completeRegistration);
router.post('/login', validateRequest(loginSchema), authController.login);

export default router;
