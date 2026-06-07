import { Router } from 'express';
import { placeBid, getBidsByItem } from './bids.controller';
import { requireAuth } from '../../middlewares/auth';

const router = Router();

router.get('/item/:catalogItemId', getBidsByItem);
router.post('/item/:catalogItemId', requireAuth, placeBid);

export default router;
