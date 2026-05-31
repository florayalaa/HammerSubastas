import { Router } from 'express';
import { placeBid, getBidsByAuction } from './bids.controller';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/auction/:auctionId', getBidsByAuction);
router.post('/auction/:auctionId', requireAuth, placeBid);

export default router;
