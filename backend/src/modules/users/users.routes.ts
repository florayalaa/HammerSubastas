import { Router } from 'express';
import { usersController } from './users.controller';
import { requireAuth } from '../../middlewares/auth';
import { validateRequest } from '../../middlewares/validateRequest';
import { updateProfileSchema } from './users.schema';

const router = Router();

// Todas las rutas de usuario requieren autenticación
router.use(requireAuth as any);

router.get('/me', usersController.getProfile as any);
router.put('/me', validateRequest(updateProfileSchema), usersController.updateProfile as any);

router.post('/me/documents', usersController.uploadDocuments as any);
router.get('/me/documents', usersController.getDocumentStatus as any);

router.get('/me/stats', usersController.getStats as any);
router.get('/me/category', usersController.getCategory as any);

export default router;
