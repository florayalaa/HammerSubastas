import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/autenticacion';
import { io } from '../../index';

const prisma = new PrismaClient();

function getCurrentPrice(pujos: any[], precioBase: any): number {
  if (!pujos || pujos.length === 0) return Number(precioBase);
  return Math.max(...pujos.map((p: any) => Number(p.importe)));
}

export const placeBid = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = parseInt(req.params.catalogItemId);
    const amount = parseFloat(req.body.amount);
    const clienteId = parseInt(req.user?.id?.toString() ?? '0');
    const metodoPagoId = req.body.metodoPagoId ? parseInt(req.body.metodoPagoId) : null;

    if (isNaN(itemId) || isNaN(amount) || !clienteId) {
      return res.status(400).json({ error: 'Invalid data' });
    }

    // Cargamos el método de pago una sola vez para reutilizarlo en ambas validaciones
    let metodoPago = null;
    if (metodoPagoId) {
      metodoPago = await prisma.extra_metodosPago.findUnique({
        where: { identificador: metodoPagoId },
      });
    }

    const item = await prisma.itemsCatalogo.findUnique({
      where: { identificador: itemId },
      include: {
        pujos: true,
        catalogos: {
          include: {
            subastas: {
              include: { extra_subastas: true },
            },
          },
        },
      },
    });

    if (!item) return res.status(404).json({ error: 'Item not found' });

    const subasta = item.catalogos?.subastas;
    if (!subasta || subasta.estado !== 'abierta') {
      return res.status(400).json({ error: 'Auction is not active' });
    }

    // Validación: horario de la subasta
    const now = new Date();
    const hora = new Date(subasta.hora);
    const startDateTime = subasta.fecha ? new Date(subasta.fecha) : new Date(hora);
    startDateTime.setHours(hora.getHours(), hora.getMinutes(), hora.getSeconds(), 0);

    if (now < startDateTime) {
      return res.status(400).json({ error: 'La subasta aún no ha comenzado.' });
    }

    const extra = (subasta.extra_subastas as any[])?.[0];
    if (extra?.fechaFin && new Date(extra.fechaFin) < now) {
      return res.status(400).json({ error: 'La subasta ya ha finalizado.' });
    }

    const monedaSubasta = extra?.moneda ?? null;
    // Validación: subasta en USD no admite cheques
    if (monedaSubasta === 'USD' && metodoPago?.tipo === 'cheque') {
      return res.status(400).json({
        error: 'Las subastas en dólares no admiten pago con cheque. Usá una tarjeta de crédito o una cuenta bancaria.',
      });
    }

    // Validación: cheque con garantía insuficiente
    if (metodoPago?.tipo === 'cheque') {
      const garantia = Number(metodoPago.montoGarantia ?? 0);
      if (garantia < amount) {
        return res.status(400).json({
          error: 'El monto de tu cheque verificado no alcanza para esta puja. Elegí otro medio de pago o ajustá el monto.',
        });
      }
    }

    const subastaId = subasta.identificador;

    const attendee = await prisma.asistentes.findFirst({
      where: { cliente: clienteId, subasta: subastaId },
    });
    if (!attendee) {
      return res.status(403).json({ error: 'Must be registered to bid' });
    }

    const currentPrice = getCurrentPrice(item.pujos, item.precioBase);
    if (amount <= currentPrice) {
      return res.status(400).json({ error: 'Bid amount must be greater than current price' });
    }

    const puja = await prisma.pujos.create({
      data: {
        asistente: attendee.identificador,
        item: itemId,
        importe: amount,
        ganador: 'no',
      },
      include: {
        asistentes: {
          include: { clientes: { include: { personas: true } } },
        },
      },
    });

    const nombre = puja.asistentes?.clientes?.personas?.nombre ?? '';
    const bidResponse = {
      id: puja.identificador.toString(),
      amount: Number(puja.importe),
      catalogItemId: itemId.toString(),
      user: {
        id: clienteId.toString(),
        firstName: nombre.split(' ')[0] ?? '',
        lastName: nombre.split(' ').slice(1).join(' ') ?? '',
      },
    };

    io.to(`auction_${itemId}`).emit('new_bid', bidResponse);

    res.status(201).json(bidResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error placing bid' });
  }
};

export const getBidsByItem = async (req: AuthRequest, res: Response) => {
  try {
    const itemId = parseInt(req.params.catalogItemId);
    if (isNaN(itemId)) return res.status(400).json({ error: 'Invalid id' });

    const pujos = await prisma.pujos.findMany({
      where: { item: itemId },
      orderBy: { identificador: 'desc' },
      include: {
        asistentes: {
          include: {
            clientes: {
              include: { personas: true },
            },
          },
        },
      },
    });

    const bids = pujos.map((p) => {
      const nombre = p.asistentes?.clientes?.personas?.nombre ?? '';
      return {
        id: p.identificador.toString(),
        amount: Number(p.importe),
        catalogItemId: itemId.toString(),
        user: {
          id: p.asistentes?.clientes?.identificador?.toString() ?? '',
          firstName: nombre.split(' ')[0] ?? '',
          lastName: nombre.split(' ').slice(1).join(' ') ?? '',
        },
      };
    });

    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bids' });
  }
};

export const getMyBids = async (req: AuthRequest, res: Response) => {
  try {
    const clienteId = parseInt(req.user?.id?.toString() ?? '0');
    if (!clienteId) return res.status(401).json({ error: 'Unauthorized' });

    const pujos = await prisma.pujos.findMany({
      where: {
        asistentes: { cliente: clienteId },
      },
      orderBy: { identificador: 'desc' },
      include: {
        itemsCatalogo: {
          include: {
            productos: true,
            pujos: true,
            catalogos: {
              include: {
                subastas: {
                  include: { extra_subastas: true },
                },
              },
            },
          },
        },
      },
    });

    const result = pujos.map((p) => {
      const item = p.itemsCatalogo;
      const subasta = item?.catalogos?.subastas;
      const extra = subasta?.extra_subastas?.[0];
      const currentPrice = getCurrentPrice(item?.pujos ?? [], item?.precioBase ?? 0);
      return {
        id: p.identificador.toString(),
        amount: Number(p.importe),
        ganador: p.ganador === 'si',
        catalogItem: {
          id: item?.identificador?.toString() ?? '',
          title: item?.productos?.descripcionCatalogo ?? '',
          currentPrice,
          auctionId: subasta?.identificador?.toString() ?? '',
          auctionTitle: extra?.titulo ?? 'Sin título',
          auctionStatus: subasta?.estado ?? 'pendiente',
          fechaFin: extra?.fechaFin ?? null,
          subastado: item?.subastado ?? 'no',
        },
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user bids' });
  }
};
