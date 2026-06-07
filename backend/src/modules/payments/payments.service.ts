import { prisma } from '../../config/database';

export class PaymentsService {
  async addPaymentMethod(data: { userId: string, cardNumber: string, expiry: string, cvc: string }) {
    // Validar tarjeta básica (dummy logic)
    if (data.cardNumber.length < 13) {
      throw new Error('Número de tarjeta inválido');
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: data.userId
      }
    });

    return method;
  }

  async getMyPaymentMethods(userId: string) {
    return await prisma.paymentMethod.findMany({
      where: { userId }
    });
  }

  async removePaymentMethod(paymentId: string, userId: string) {
    const payment = await prisma.paymentMethod.findUnique({
      where: { id: paymentId }
    });

    if (!payment) throw new Error('Método de pago no encontrado');
    if (payment.userId !== userId) throw new Error('No autorizado');

    await prisma.paymentMethod.delete({
      where: { id: paymentId }
    });

    return { message: 'Eliminado correctamente' };
  }
}

export const paymentsService = new PaymentsService();
