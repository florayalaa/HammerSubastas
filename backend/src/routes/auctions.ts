import { Router } from 'express';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ auctions: [] });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.json({ auction: { id, title: `Auction ${id}`, status: 'draft' } });
});

router.post('/', (req, res) => {
  const { title } = req.body;
  res.status(201).json({ message: `Auction '${title}' created` });
});

export default router;
