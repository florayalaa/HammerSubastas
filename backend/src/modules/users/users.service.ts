import { prisma } from '../../config/database';
import { UserCategory } from '@prisma/client';

export class UsersService {
  async getUserProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        address: true,
        category: true,
        isApproved: true,
        documentFront: true,
        documentBack: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }

  async updateProfile(userId: string, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        country: data.country,
        address: data.address,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        country: true,
        address: true,
        category: true,
      },
    });

    return user;
  }

  async uploadDocuments(userId: string, frontUrl: string, backUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        documentFront: frontUrl,
        documentBack: backUrl,
      },
    });
  }

  async getUserStats(userId: string) {
    // Mock temporal, esto dependerá de módulos "auctions" y "items"
    return {
      totalBids: 15,
      auctionsWon: 3,
      itemsSold: 1,
    };
  }

  // Funciones exportadas según el BACKEND_PLAN.md
  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  }

  async getUserCategory(id: string): Promise<UserCategory> {
    const user = await prisma.user.findUnique({ where: { id }, select: { category: true } });
    if (!user) throw new Error('Usuario no encontrado');
    return user.category;
  }
}

export const usersService = new UsersService();
