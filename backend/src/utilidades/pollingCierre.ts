import { prisma } from '../configuracion/baseDatos';
import { io } from '../index';
import { ahoraComparable } from './horarioArgentina';

const INACTIVIDAD_MS = 3 * 60 * 1000; // 3 minutos sin una nueva puja → se cierra el ítem

// Declara ganador (o "sin ganador" si nadie pujó) para un ítem puntual: marca la puja
// ganadora, el ítem como subastado, actualiza el estado del artículo para el vendedor,
// crea el registro de venta, notifica al ganador y a los demás postores, y emite el socket.
async function cerrarItem(item: any, subasta: any) {
  if (item.pujos.length === 0) {
    await prisma.$transaction([
      prisma.itemsCatalogo.update({ where: { identificador: item.identificador }, data: { subastado: 'si' } }),
      prisma.extra_solicitudesVenta.updateMany({
        where: { producto: item.productos.identificador },
        data: { estado: 'no_vendido', fechaActualizacion: new Date() },
      }),
    ]);
    io.to(`auction_${item.identificador}`).emit('auction_ended', {
      itemId: item.identificador.toString(),
      winnerId: null,
      finalAmount: null,
    });
    console.log(`[Cierre] item ${item.identificador}: sin pujas, marcado sin ganador`);
    return;
  }

  const ordenadas = [...item.pujos].sort((a: any, b: any) => Number(b.importe) - Number(a.importe));
  const pujaGanadora = ordenadas[0];
  const clienteGanador = pujaGanadora.asistentes.cliente;

  await prisma.$transaction([
    prisma.pujos.update({ where: { identificador: pujaGanadora.identificador }, data: { ganador: 'si' } }),
    prisma.itemsCatalogo.update({ where: { identificador: item.identificador }, data: { subastado: 'si' } }),
    prisma.extra_solicitudesVenta.updateMany({
      where: { producto: item.productos.identificador },
      data: { estado: 'vendido', fechaActualizacion: new Date() },
    }),
  ]);

  const yaExiste = await prisma.registroDeSubasta.findFirst({
    where: { subasta: subasta.identificador, producto: item.productos.identificador },
  });
  if (!yaExiste) {
    await prisma.registroDeSubasta.create({
      data: {
        subasta: subasta.identificador,
        duenio: item.productos.duenio,
        producto: item.productos.identificador,
        cliente: clienteGanador,
        importe: pujaGanadora.importe,
        comision: item.comision,
      },
    });
  }

  const titulo = item.productos.descripcionCatalogo ?? 'Artículo';

  await prisma.notificaciones.create({
    data: {
      identificadorPersona: clienteGanador,
      mensaje: `¡Ganaste el artículo "${titulo}" por $${Number(pujaGanadora.importe).toLocaleString('es-AR')}!`,
    },
  });

  const otrosClientes = [...new Set(
    item.pujos.map((p: any) => p.asistentes.cliente).filter((c: number) => c !== clienteGanador)
  )] as number[];
  for (const clienteId of otrosClientes) {
    await prisma.notificaciones.create({
      data: {
        identificadorPersona: clienteId,
        mensaje: `La subasta de "${titulo}" finalizó. Esta vez no fuiste el ganador.`,
      },
    });
  }

  io.to(`auction_${item.identificador}`).emit('auction_ended', {
    itemId: item.identificador.toString(),
    winnerId: clienteGanador.toString(),
    finalAmount: Number(pujaGanadora.importe),
  });

  console.log(`[Cierre] item ${item.identificador}: ganador cliente ${clienteGanador}, importe ${pujaGanadora.importe}`);
}

// Si ya no queda ningún ítem activo en la subasta, la cierra completa.
async function cerrarSubastaSiCorresponde(subastaId: number) {
  const pendientes = await prisma.itemsCatalogo.count({
    where: { catalogos: { subasta: subastaId }, subastado: { not: 'si' } },
  });
  if (pendientes === 0) {
    const actualizada = await prisma.subastas.updateMany({
      where: { identificador: subastaId, estado: { not: 'cerrada' } },
      data: { estado: 'cerrada' },
    });
    if (actualizada.count > 0) {
      console.log(`[Cierre] subasta ${subastaId} → cerrada (todos los ítems resueltos)`);
    }
  }
}

// ─── cierre por fechaFin de la subasta (respaldo para ítems sin ninguna puja) ────

async function cerrarSubastasVencidas() {
  const now = ahoraComparable();

  const extras = await prisma.extra_subastas.findMany({
    where: {
      fechaFin: { not: null, lt: now },
      subastas: { estado: { not: 'cerrada' } },
    },
    include: {
      subastas: {
        include: {
          catalogos: {
            include: {
              itemsCatalogo: {
                where: { subastado: { not: 'si' } },
                include: {
                  pujos: { include: { asistentes: true } },
                  productos: true,
                },
              },
            },
          },
        },
      },
    },
  });

  for (const extra of extras) {
    const subasta = extra.subastas;
    console.log(`[Cierre] procesando subasta ${subasta.identificador} (${extra.titulo})`);

    for (const catalogo of subasta.catalogos) {
      for (const item of catalogo.itemsCatalogo) {
        await cerrarItem(item, subasta);
      }
    }

    await prisma.subastas.update({
      where: { identificador: subasta.identificador },
      data: { estado: 'cerrada' },
    });

    console.log(`[Cierre] subasta ${subasta.identificador} → cerrada`);
  }
}

// ─── cierre por inactividad (3 min sin una nueva puja desde la última) ───────────

async function cerrarItemsPorInactividad() {
  const limite = new Date(Date.now() - INACTIVIDAD_MS);

  const items = await prisma.itemsCatalogo.findMany({
    where: {
      subastado: { not: 'si' },
      pujos: { some: {} },
      catalogos: { subastas: { estado: 'abierta' } },
    },
    include: {
      pujos: { include: { asistentes: true, extra_pujos: true }, orderBy: { extra_pujos: { fecha: 'desc' } } },
      productos: true,
      catalogos: { include: { subastas: true } },
    },
  });

  for (const item of items) {
    const ultimaPuja = item.pujos[0];
    if (!ultimaPuja?.extra_pujos || ultimaPuja.extra_pujos.fecha > limite) continue; // todavía dentro de la ventana de 3 min

    const subasta = item.catalogos.subastas;
    if (!subasta) continue;

    await cerrarItem(item, subasta);
    await cerrarSubastaSiCorresponde(subasta.identificador);
  }
}

// Si alguien extiende manualmente el fechaFin de una subasta ya cerrada a un valor futuro,
// la reabre sola. Solo reabre los ítems que se cerraron SIN ganador (nadie pujó a tiempo);
// los que ya tienen una puja ganadora declarada quedan como están, para no invalidar una venta ya resuelta.
async function reabrirSubastasExtendidas() {
  const now = ahoraComparable();

  const extras = await prisma.extra_subastas.findMany({
    where: {
      fechaFin: { not: null, gt: now },
      subastas: { estado: 'cerrada' },
    },
    include: {
      subastas: {
        include: {
          catalogos: {
            include: { itemsCatalogo: { where: { subastado: 'si' } } },
          },
        },
      },
    },
  });

  for (const extra of extras) {
    const subasta = extra.subastas;

    await prisma.subastas.update({
      where: { identificador: subasta.identificador },
      data: { estado: 'abierta' },
    });

    for (const catalogo of subasta.catalogos) {
      for (const item of catalogo.itemsCatalogo) {
        const tieneGanador = await prisma.pujos.findFirst({
          where: { item: item.identificador, ganador: 'si' },
        });
        if (!tieneGanador) {
          await prisma.itemsCatalogo.update({
            where: { identificador: item.identificador },
            data: { subastado: 'no' },
          });
        }
      }
    }

    console.log(`[Cierre] subasta ${subasta.identificador} (${extra.titulo}) → reabierta (fechaFin extendido a futuro)`);
  }
}

export function iniciarPollingCierre(intervaloMs = 30000) {
  setInterval(async () => {
    try {
      await reabrirSubastasExtendidas();
      await cerrarItemsPorInactividad();
      await cerrarSubastasVencidas();
    } catch (err) {
      console.error('[Cierre] error:', err);
    }
  }, intervaloMs);
  console.log(`[Cierre] polling iniciado (cada ${intervaloMs / 1000}s)`);
}
