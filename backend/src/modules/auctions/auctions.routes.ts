import { Router } from 'express';
import { getAuctions, getAuctionById, createAuction } from './auctions.controller';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/', getAuctions);
router.get('/:id', getAuctionById);
router.post('/', requireAuth, createAuction);

export default router;
