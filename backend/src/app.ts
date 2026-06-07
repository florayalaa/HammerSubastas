import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import usersRoutes from './modules/users/users.routes';
import auctionsRoutes from './modules/auctions/auctions.routes';
import bidsRoutes from './modules/bids/bids.routes';
import countriesRoutes from './modules/countries/countries.routes';
import { articlesRoutes } from './modules/articles/articles.routes';
import { paymentsRoutes } from './modules/payments/payments.routes';
import { notificationsRoutes } from './modules/notifications/notifications.routes';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/countries', countriesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auctions', auctionsRoutes);
app.use('/api/bids', bidsRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/notifications', notificationsRoutes);

export default app;
