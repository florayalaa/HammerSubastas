import { Router } from 'express';

const router = Router();

router.get('/profile', (_req, res) => {
  res.json({ user: { id: 'user-1', name: 'Demo User', email: 'demo@example.com' } });
});

export default router;
