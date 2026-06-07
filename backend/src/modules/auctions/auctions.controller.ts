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
        catalogItems: true
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

export const registerForAuction = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params; // auctionId
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const auction = await prisma.auction.findUnique({ where: { id } });
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    const existing = await prisma.auctionAttendee.findUnique({
      where: { auctionId_userId: { auctionId: id, userId } }
    });

    if (existing) {
      return res.status(400).json({ error: 'User is already registered for this auction', bidderNum: existing.bidderNum });
    }

    const attendee = await prisma.auctionAttendee.create({
      data: { auctionId: id, userId }
    });

    res.json({ success: true, bidderNum: attendee.bidderNum });
  } catch (error) {
    console.error('Error registering for auction:', error);
    res.status(500).json({ error: 'Error registering for auction' });
  }
};
