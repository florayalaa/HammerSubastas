import { Router } from 'express';
import { placeBid, getBidsByItem, getMyBids } from './bids.controller';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/my-bids', requireAuth, getMyBids);
router.get('/item/:catalogItemId', getBidsByItem);
router.post('/item/:catalogItemId', requireAuth, placeBid);

export default router;
