import { Router } from 'express';
import { requireAuth, optionalAuth } from '../../middlewares/autenticacion';
import {
  createAuction,
  getAuctions,
  getAuctionById,
  registerForAuction
} from './subastas.controller';

const router = Router();

router.post('/', requireAuth, createAuction);
router.get('/', optionalAuth, getAuctions);
router.get('/:id', getAuctionById);
router.post('/:id/registrar', requireAuth, registerForAuction);

export default router;
