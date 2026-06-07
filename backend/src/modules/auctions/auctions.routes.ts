import { Router } from 'express';
import { requireAuth } from '../../middlewares/auth';
import {
  createAuction,
  getAuctions,
  getAuctionById,
  registerForAuction
} from './auctions.controller';

const router = Router();

router.post('/', requireAuth, createAuction);
router.get('/', getAuctions);
router.get('/:id', getAuctionById);
router.post('/:id/register', requireAuth, registerForAuction);

export default router;
