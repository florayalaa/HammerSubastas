import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth';

const prisma = new PrismaClient();

export const getAuctions = async (req: AuthRequest, res: Response) => {
  try {
    const auctions = await prisma.auction.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auctions' });
  }
};

export const getAuctionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const auction = await prisma.auction.findUnique({
      where: { id },
      include: {
        bids: {
          orderBy: { amount: 'desc' },
          include: { user: { select: { id: true, firstName: true, lastName: true } } }
        }
      }
    });
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    res.json(auction);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auction' });
  }
};

export const createAuction = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startingPrice, startDate, endDate } = req.body;
    
    const auction = await prisma.auction.create({
      data: {
        title,
        description,
        startingPrice: parseFloat(startingPrice),
        currentPrice: parseFloat(startingPrice),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'PENDING'
      }
    });

    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ error: 'Error creating auction' });
  }
};
