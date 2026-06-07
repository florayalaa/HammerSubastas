import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth';
import { io } from '../../index';

const prisma = new PrismaClient();

export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    const { auctionId } = req.params;
    const { amount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const auction = await prisma.auction.findUnique({ where: { id: auctionId } });
    
    if (!auction) {
      return res.status(404).json({ error: 'Auction not found' });
    }
    
    if (auction.status !== 'ACTIVE' && auction.status !== 'PENDING') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    if (parseFloat(amount) <= auction.currentPrice) {
      return res.status(400).json({ error: 'Bid amount must be greater than current price' });
    }

    const [bid] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          auctionId,
          userId: userId.toString()
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true } }
        }
      }),
      prisma.auction.update({
        where: { id: auctionId },
        data: { currentPrice: parseFloat(amount) }
      })
    ]);

    // Emit event to Socket.io room
    io.to(`auction_${auctionId}`).emit('new_bid', bid);

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error placing bid' });
  }
};

export const getBidsByAuction = async (req: AuthRequest, res: Response) => {
  try {
    const { auctionId } = req.params;
    const bids = await prisma.bid.findMany({
      where: { auctionId },
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } }
      }
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bids' });
  }
};
