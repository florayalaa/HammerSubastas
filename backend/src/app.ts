import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth';
import auctionsRoutes from './routes/auctions';
import usersRoutes from './routes/users';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/auctions', auctionsRoutes);
app.use('/users', usersRoutes);

export default app;
