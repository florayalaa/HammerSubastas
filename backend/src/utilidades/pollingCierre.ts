import { prisma } from '../configuracion/baseDatos';
import { io } from '../index';

async function cerrarSubastasVencidas() {
  const now = new Date();

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
                  pujos: {
                    include: { asistentes: true },
                    orderBy: { importe: 'desc' },
                  },
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
        if (item.pujos.length === 0) {
          await prisma.itemsCatalogo.update({
            where: { identificador: item.identificador },
            data: { subastado: 'si' },
          });
          console.log(`[Cierre] item ${item.identificador}: sin pujas, marcado sin ganador`);
          continue;
        }

        const pujaGanadora = item.pujos[0]; // ya ordenadas desc por importe
        const clienteGanador = pujaGanadora.asistentes.cliente;

        await prisma.$transaction([
          // Marcar puja ganadora
          prisma.pujos.update({
            where: { identificador: pujaGanadora.identificador },
            data: { ganador: 'si' },
          }),
          // Marcar ítem como subastado
          prisma.itemsCatalogo.update({
            where: { identificador: item.identificador },
            data: { subastado: 'si' },
          }),
        ]);

        // Crear registro de venta si no existe
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

        // Notificar al ganador
        await prisma.notificaciones.create({
          data: {
            identificadorPersona: clienteGanador,
            mensaje: `¡Ganaste el artículo "${item.productos.descripcionCatalogo ?? 'Artículo'}" por $${Number(pujaGanadora.importe).toLocaleString('es-AR')}!`,
          },
        });

        // Emitir evento socket a todos en la sala del ítem
        io.to(`auction_${item.identificador}`).emit('auction_ended', {
          itemId: item.identificador.toString(),
          winnerId: clienteGanador.toString(),
          finalAmount: Number(pujaGanadora.importe),
        });

        console.log(`[Cierre] item ${item.identificador}: ganador cliente ${clienteGanador}, importe ${pujaGanadora.importe}`);
      }
    }

    // Cerrar la subasta
    await prisma.subastas.update({
      where: { identificador: subasta.identificador },
      data: { estado: 'cerrada' },
    });

    console.log(`[Cierre] subasta ${subasta.identificador} → cerrada`);
  }
}

export function iniciarPollingCierre(intervaloMs = 30000) {
  setInterval(async () => {
    try {
      await cerrarSubastasVencidas();
    } catch (err) {
      console.error('[Cierre] error:', err);
    }
  }, intervaloMs);
  console.log(`[Cierre] polling iniciado (cada ${intervaloMs / 1000}s)`);
}
