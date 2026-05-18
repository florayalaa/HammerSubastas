import { Router } from 'express';

const router = Router();

router.post('/login', (req, res) => {
  const { email } = req.body;
  // Return a mock user + token to simulate real auth
  const user = {
    id: 1,
    firstName: 'Juan',
    lastName: 'Pérez',
    email,
    category: 'Oro',
    verified: true,
    hasPaymentMethods: true,
  };
  const token = 'demo-token-123';
  res.json({ user, token });
});

router.post('/register', (req, res) => {
  const { email, firstName, lastName } = req.body;
  const user = {
    id: 2,
    firstName: firstName ?? 'Nuevo',
    lastName: lastName ?? 'Usuario',
    email,
    category: 'Común',
    verified: false,
    hasPaymentMethods: false,
  };
  const token = 'demo-token-registered-456';
  res.status(201).json({ user, token });
});

router.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  res.json({ message: `Password reset link sent to ${email}` });
});

export default router;
