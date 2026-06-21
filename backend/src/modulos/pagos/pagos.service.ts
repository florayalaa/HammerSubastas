import { prisma } from '../../configuracion/baseDatos';

export class PaymentsService {
  async addPaymentMethod(data: {
    userId: string;
    cardNumber: string;
    expiry?: string;
    cvc?: string;
    tipo?: string;
    titular?: string;
    banco?: string;
    paisCuenta?: string;
    alias?: string;
  }) {
    const tipo = data.tipo || 'tarjeta';

    if (!data.cardNumber) {
      throw new Error('El número / identificador es requerido');
    }
    if (tipo === 'tarjeta' && data.cardNumber.replace(/\s/g, '').length < 13) {
      throw new Error('Número de tarjeta inválido');
    }
    if (tipo === 'cuenta bancaria' && data.cardNumber.replace(/\s/g, '').length !== 22) {
      throw new Error('El CBU debe tener exactamente 22 dígitos');
    }

    const method = await prisma.extra_metodosPago.create({
      data: {
        cliente: parseInt(data.userId),
        tipo,
        numero: data.cardNumber.replace(/\s/g, ''),
        vencimiento: data.expiry || null,
        cvv: data.cvc || null,
        titular: data.titular || null,
        banco: data.banco || null,
        paisCuenta: data.paisCuenta || null,
        alias: data.alias || null,
        estado: tipo === 'cheque' ? 'pendiente' : 'verificado',
      },
    });

    return method;
  }

  async getMyPaymentMethods(userId: string) {
    return prisma.extra_metodosPago.findMany({
      where: { cliente: parseInt(userId) },
    });
  }

  async removePaymentMethod(paymentId: string, userId: string) {
    const payment = await prisma.extra_metodosPago.findUnique({
      where: { identificador: parseInt(paymentId) },
    });

    if (!payment) throw new Error('Método de pago no encontrado');
    if (payment.cliente !== parseInt(userId)) throw new Error('No autorizado');

    await prisma.extra_metodosPago.delete({
      where: { identificador: parseInt(paymentId) },
    });

    return { message: 'Eliminado correctamente' };
  }
}

export const paymentsService = new PaymentsService();
