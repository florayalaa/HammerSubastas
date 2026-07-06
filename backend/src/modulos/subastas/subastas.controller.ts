import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../../middlewares/autenticacion';
import { ahoraComparable } from '../../utilidades/horarioArgentina';

const prisma = new PrismaClient();

const EMPLEADO_DEFAULT = 1;

function getMimeType(buf: Buffer): string {
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) return 'image/gif';
  return 'image/jpeg';
}

function fotoABase64(raw: any): string | null {
  if (!raw) return null;
  const buf = Buffer.from(raw);
  return `data:${getMimeType(buf)};base64,${buf.toString('base64')}`;
} // empleado verificador por defecto para catálogos

function mergeDateTime(fecha: Date | null, hora: Date): Date {
  if (!fecha) return hora;
  const d = new Date(fecha);
  d.setHours(hora.getHours(), hora.getMinutes(), hora.getSeconds(), hora.getMilliseconds());
  return d;
}

function deriveStatus(subasta: any): string {
  if (!subasta.estado) return 'pendiente';
  const extra = subasta.extra_subastas?.[0];
  const now = ahoraComparable();
  if (extra?.fechaFin && new Date(extra.fechaFin) < now) return 'cerrada';
  const startDate = mergeDateTime(subasta.fecha, subasta.hora);
  if (startDate > now) return 'pendiente';
  return subasta.estado;
}

function mapItem(item: any, subastaId: string) {
  const importes = item.pujos?.map((p: any) => Number(p.importe)) ?? [];
  const currentPrice = importes.length > 0 ? Math.max(...importes) : Number(item.precioBase);
  const winnerPuja = item.pujos?.find((p: any) => p.ganador === 'si');
  const productoId = item.productos?.identificador ?? item.producto;
  const image = item.productos?.fotos?.length > 0 ? `/articulos/${productoId}/foto` : null;
  return {
    id: item.identificador.toString(),
    auctionId: subastaId,
    productId: productoId,
    title: item.productos?.descripcionCatalogo ?? '',
    description: item.productos?.descripcionCompleta ?? '',
    startingPrice: Number(item.precioBase),
    currentPrice,
    image,
    winnerId: winnerPuja ? winnerPuja.asistente?.toString() ?? null : null,
    status: item.subastado === 'si' ? 'vendido' : 'pendiente',
  };
}

function mapSubasta(s: any) {
  const extra = s.extra_subastas?.[0];
  const items = (s.catalogos ?? []).flatMap((c: any) =>
    (c.itemsCatalogo ?? []).map((item: any) => mapItem(item, s.identificador.toString()))
  );

  // Foto del primer item del primer catálogo (los artículos siempre tienen al menos 6 fotos)
  const rawFoto = s.catalogos?.[0]?.itemsCatalogo?.[0]?.productos?.fotos?.[0]?.foto ?? null;
  let imagen: string | null = null;
  if (rawFoto) {
    const buf = Buffer.from(rawFoto);
    if (buf.length > 4) imagen = `data:${getMimeType(buf)};base64,${buf.toString('base64')}`;
  }

  // Precio mínimo entre todos los items
  const precios = (s.catalogos ?? []).flatMap((c: any) =>
    (c.itemsCatalogo ?? []).map((item: any) => Number(item.precioBase))
  ).filter((p: number) => !isNaN(p) && p > 0);
  const startingPrice = precios.length > 0 ? Math.min(...precios) : null;

  return {
    id: s.identificador.toString(),
    title: extra?.titulo ?? 'Sin título',
    description: extra?.descripcion ?? null,
    startDate: s.fecha ?? s.hora,
    startTime: s.hora,
    endDate: extra?.fechaFin ?? null,
    category: s.categoria ?? null,
    currency: extra?.moneda ?? 'pesos',
    status: deriveStatus(s),
    itemsCount: items.length,
    startingPrice,
    image: imagen,
    catalogItems: items,
    location: s.ubicacion ?? null,
    auctioneer: s.subastadores?.personas?.nombre ?? null,
    capacity: s.capacidadAsistentes ?? null,
    goodsCategory: extra?.categoriaBien ?? null,
    isCollection: extra?.esColeccion ?? false,
  };
}

const includeSubasta = {
  extra_subastas: true,
  subastadores: { include: { personas: true } },
  catalogos: {
    orderBy: { identificador: 'asc' as const },
    include: {
      itemsCatalogo: {
        orderBy: { identificador: 'asc' as const },
        include: {
        productos: {
        include: { fotos: { take: 1, orderBy: { identificador: 'asc' as const } } },
        },
          pujos: true,
        },
      },
    },
  },
};

const RANGO_CATEGORIA: Record<string, number> = {
  comun: 1, especial: 2, plata: 3, oro: 4, platino: 5,
};

function categoriasPermitidas(userCategory: string | undefined): string[] | null {
  if (!userCategory) return null; // sin filtro para no autenticados
  const rango = RANGO_CATEGORIA[userCategory.toLowerCase()] ?? 1;
  return Object.entries(RANGO_CATEGORIA)
    .filter(([, r]) => r <= rango)
    .map(([cat]) => cat);
}

export const getCategorias = async (req: AuthRequest, res: Response) => {
  try {
    const permitidas = categoriasPermitidas((req as any).user?.category);
    const rows = await prisma.subastas.findMany({
      where: permitidas ? { categoria: { in: permitidas } } : undefined,
      select: { categoria: true },
    });
    const categorias = [...new Set(
      rows.map((r) => r.categoria ?? 'comun')
    )].sort((a, b) => (RANGO_CATEGORIA[a] ?? 99) - (RANGO_CATEGORIA[b] ?? 99));
    res.json(categorias);
  } catch (error) {
    console.error('[getCategorias] error:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
};

export const getAuctions = async (req: AuthRequest, res: Response) => {
  try {
    const permitidas = categoriasPermitidas((req as any).user?.category);
    const ahora = ahoraComparable();
    const subastas = await prisma.subastas.findMany({
      where: {
        ...(permitidas ? { categoria: { in: permitidas } } : { categoria: { not: null } }),
        catalogos: { some: { itemsCatalogo: { some: {} } } },
        NOT: { extra_subastas: { some: { fechaFin: { lt: ahora } } } },
      },
      include: includeSubasta,
      orderBy: { identificador: 'desc' },
    });
    res.json(subastas.map(mapSubasta));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auctions' });
  }
};

export const getAuctionById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

    const subasta = await prisma.subastas.findUnique({
      where: { identificador: id },
      include: includeSubasta,
    });
    if (!subasta) return res.status(404).json({ error: 'Auction not found' });
    res.json(mapSubasta(subasta));
  } catch (error) {
    res.status(500).json({ error: 'Error fetching auction' });
  }
};

export const createAuction = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, startDate, endDate, category, goodsCategory } = req.body;

    const subasta = await prisma.subastas.create({
      data: {
        fecha: startDate ? new Date(startDate) : new Date(),
        hora: startDate ? new Date(startDate) : new Date(),
        estado: 'abierta',
        categoria: category ?? null,
        extra_subastas: {
          create: {
            titulo: title,
            descripcion: description ?? null,
            categoriaBien: goodsCategory ?? null,
          },
        },
        catalogos: {
          create: {
            descripcion: title,
            responsable: EMPLEADO_DEFAULT,
          },
        },
      },
      include: includeSubasta,
    });

    res.status(201).json(mapSubasta(subasta));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error creating auction' });
  }
};

export const registerForAuction = async (req: AuthRequest, res: Response) => {
  try {
    const subastaId = parseInt(req.params.id);
    const clienteId = parseInt(req.user?.id?.toString() ?? '0');
    if (isNaN(subastaId) || !clienteId) return res.status(400).json({ error: 'Invalid data' });

    const subasta = await prisma.subastas.findUnique({ where: { identificador: subastaId } });
    if (!subasta) return res.status(404).json({ error: 'Auction not found' });

    const metodosPago = await prisma.extra_metodosPago.count({
      where: { cliente: clienteId, estado: 'verificado' },
    });
    if (metodosPago === 0) {
      return res.status(403).json({ error: 'Necesitás al menos un método de pago verificado para participar.' });
    }

    const existing = await prisma.asistentes.findFirst({
      where: { cliente: clienteId, subasta: subastaId },
    });
    if (existing) {
      return res.json({ success: true, bidderNum: existing.numeroPostor });
    }

    const count = await prisma.asistentes.count({ where: { subasta: subastaId } });
    const attendee = await prisma.asistentes.create({
      data: { cliente: clienteId, subasta: subastaId, numeroPostor: count + 1 },
    });

    res.json({ success: true, bidderNum: attendee.numeroPostor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error registering for auction' });
  }
};

