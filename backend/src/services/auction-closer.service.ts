import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const checkAndCloseAuctions = async () => {
  try {
    const now = new Date();
    
    // Find all active auctions that have passed their end date
    const expiredAuctions = await prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        endDate: { lte: now }
      },
      include: {
        catalogItems: true
      }
    });

    for (const auction of expiredAuctions) {
      // 1. Mark auction as closed
      await prisma.auction.update({
        where: { id: auction.id },
        data: { status: 'CLOSED' }
      });

      // 2. Process each item to find the winner
      for (const item of auction.catalogItems) {
        const highestBid = await prisma.bid.findFirst({
          where: { catalogItemId: item.id },
          orderBy: { amount: 'desc' },
          include: { user: true }
        });

        if (highestBid) {
          // Item sold
          await prisma.catalogItem.update({
            where: { id: item.id },
            data: {
              status: 'SOLD',
              winnerId: highestBid.userId,
            }
          });

          // Create notification for the winner
          await prisma.notification.create({
            data: {
              userId: highestBid.userId,
              message: `¡Felicidades! Has ganado el artículo "${item.title}" por $${highestBid.amount}.`
            }
          });

          // Generate a bill/record (Using Legacy registroDeSubasta if connected, or a modern equivalent, or just rely on the SOLD status)
          // Since we don't have a modern AuctionRecord in the new schema, the SOLD status + winnerId is enough for now.
        } else {
          // Item unsold
          await prisma.catalogItem.update({
            where: { id: item.id },
            data: { status: 'UNSOLD' }
          });
        }
      }
    }
  } catch (error) {
    console.error('Error in auction closer service:', error);
  }
};
