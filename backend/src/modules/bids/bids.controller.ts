import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/auth';
import { io } from '../../index';

const prisma = new PrismaClient();

export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    const { catalogItemId } = req.params;
    const { amount } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const item = await prisma.catalogItem.findUnique({ 
      where: { id: catalogItemId },
      include: { auction: true }
    });
    
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    // Validar si la subasta está activa
    if (item.auction.status !== 'ACTIVE' && item.auction.status !== 'PENDING') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    // Validar inscripción del asistente (si existe lógica de asistentes)
    const attendee = await prisma.auctionAttendee.findUnique({
      where: { auctionId_userId: { auctionId: item.auctionId, userId: userId.toString() } }
    });

    if (!attendee) {
      return res.status(403).json({ error: 'Must be registered to bid' });
    }

    if (parseFloat(amount) <= item.currentPrice) {
      return res.status(400).json({ error: 'Bid amount must be greater than current price' });
    }

    const [bid] = await prisma.$transaction([
      prisma.bid.create({
        data: {
          amount: parseFloat(amount),
          catalogItemId,
          userId: userId.toString()
        },
        include: {
          user: { select: { id: true, firstName: true, lastName: true } }
        }
      }),
      prisma.catalogItem.update({
        where: { id: catalogItemId },
        data: { currentPrice: parseFloat(amount) }
      })
    ]);

    // Emit event to Socket.io room specific to this item
    io.to(`item_${catalogItemId}`).emit('new_bid', bid);

    res.status(201).json(bid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error placing bid' });
  }
};

export const getBidsByItem = async (req: AuthRequest, res: Response) => {
  try {
    const { catalogItemId } = req.params;
    const bids = await prisma.bid.findMany({
      where: { catalogItemId },
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
