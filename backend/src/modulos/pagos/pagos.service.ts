import { prisma } from '../../configuracion/baseDatos';

function parsearVencimiento(expiry: string | undefined, tipo: string): Date | null {
  if (!expiry) return null;
  if (tipo === 'cheque') {
    const [dd, mm, aa] = expiry.split('/');
    if (!dd || !mm || !aa) return null;
    return new Date(Date.UTC(2000 + parseInt(aa), parseInt(mm) - 1, parseInt(dd)));
  }
  const [mm, aa] = expiry.split('/');
  if (!mm || !aa) return null;
  return new Date(Date.UTC(2000 + parseInt(aa), parseInt(mm) - 1, 1));
}

export class PaymentsService {
  async addPaymentMethod(data: {
    userId: string;
    cardNumber: string;
    expiry?: string;
    cvc?: string;
    tipo?: string;
    titular?: string;
    banco?: string;
    pais?: string;
    alias?: string;
    fotoCheque?: Buffer;
    montoGarantia?: string;
  }) {
    const tipo = data.tipo || 'tarjeta de credito';

    if (!data.cardNumber) {
      throw new Error('El número / identificador es requerido');
    }
    if (tipo === 'tarjeta de credito' && data.cardNumber.replace(/\s/g, '').length < 13) {
      throw new Error('Número de tarjeta inválido');
    }
    if (tipo === 'cuenta bancaria' && data.cardNumber.replace(/\s/g, '').length !== 22) {
      throw new Error('El CBU debe tener exactamente 22 dígitos');
    }

    const clienteId = parseInt(data.userId);
    const estadoInicial = tipo === 'cheque' ? 'pendiente' : 'verificado';

    const method = await prisma.extra_metodosPago.create({
      data: {
        cliente: clienteId,
        tipo,
        numero: data.cardNumber.replace(/\s/g, ''),
        vencimiento: parsearVencimiento(data.expiry, tipo),
        cvv: data.cvc || null,
        titular: data.titular || null,
        banco: data.banco || null,
        pais: data.pais || null,
        alias: data.alias || null,
        estado: estadoInicial,
        fotoCheque: data.fotoCheque || null,
        montoGarantia: data.montoGarantia ? parseFloat(data.montoGarantia) : null,
      },
    });

    if (estadoInicial === 'verificado') {
      const etiqueta = tipo === 'tarjeta de credito' ? 'tarjeta de crédito' : 'cuenta bancaria';
      await prisma.notificaciones.create({
        data: {
          identificadorPersona: clienteId,
          mensaje: `Tu ${etiqueta} fue verificada exitosamente.`,
        },
      });
    }

    return method;
  }

  async verificarMetodoPago(paymentId: string) {
    const metodo = await prisma.extra_metodosPago.findUnique({
      where: { identificador: parseInt(paymentId) },
    });
    if (!metodo) throw new Error('Método de pago no encontrado');
    if (metodo.estado === 'verificado') throw new Error('El método ya está verificado');

    const updated = await prisma.extra_metodosPago.update({
      where: { identificador: parseInt(paymentId) },
      data: { estado: 'verificado' },
    });

    await prisma.notificaciones.create({
      data: {
        identificadorPersona: metodo.cliente,
        mensaje: `Tu cheque (Nº ${metodo.numero}) fue verificado exitosamente.`,
      },
    });

    return updated;
  }

  async getMyPaymentMethods(userId: string) {
    const methods = await prisma.extra_metodosPago.findMany({
      where: { cliente: parseInt(userId) },
      select: {
        identificador: true,
        cliente: true,
        tipo: true,
        numero: true,
        vencimiento: true,
        estado: true,
        titular: true,
        banco: true,
        pais: true,
        alias: true,
        montoGarantia: true,
      },
    });
    return methods;
  }

  async getPaymentMethodById(paymentId: string, userId: string) {
    const method = await prisma.extra_metodosPago.findUnique({
      where: { identificador: parseInt(paymentId) },
    });

    if (!method) throw new Error('Método de pago no encontrado');
    if (method.cliente !== parseInt(userId)) throw new Error('No autorizado');

    return {
      ...method,
      fotoCheque: method.fotoCheque ? method.fotoCheque.toString('base64') : null,
    };
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
