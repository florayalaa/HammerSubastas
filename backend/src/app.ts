import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import auctionsRoutes from './routes/auctions';
import usersRoutes from './modules/users/users.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/auctions', auctionsRoutes);
app.use('/api/users', usersRoutes);

export default app;
