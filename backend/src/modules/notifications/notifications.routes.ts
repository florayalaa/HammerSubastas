import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import { getMyNotifications, markAsRead } from './notifications.controller';

const router = Router();

router.get('/', requireAuth, getMyNotifications);
router.put('/:id/read', requireAuth, markAsRead);

export const notificationsRoutes = router;
