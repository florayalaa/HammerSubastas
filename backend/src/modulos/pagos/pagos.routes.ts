import { Router } from 'express';
import multer from 'multer';
import { paymentsController } from './pagos.controller';
import { requireAuth } from '../../middlewares/autenticacion';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', requireAuth, upload.single('fotoCheque'), paymentsController.addPaymentMethod.bind(paymentsController));
router.get('/', requireAuth, paymentsController.getMyPaymentMethods.bind(paymentsController));
router.get('/:id', requireAuth, paymentsController.getPaymentMethodById.bind(paymentsController));
router.patch('/:id/verificar', requireAuth, paymentsController.verificarMetodoPago.bind(paymentsController));
router.delete('/:id', requireAuth, paymentsController.removePaymentMethod.bind(paymentsController));

export const pagosRoutes = router;
