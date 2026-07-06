import { prisma } from '../../configuracion/baseDatos';

function getMimeType(buf: Buffer): string {
  if (buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46 &&
      buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) return 'image/webp';
  if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4E && buf[3] === 0x47) return 'image/png';
  if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
  return 'image/jpeg';
}

function fotoABase64(raw: any): string | null {
  if (!raw) return null;
  const buf = Buffer.from(raw);
  return `data:${getMimeType(buf)};base64,${buf.toString('base64')}`;
}

export class ArticlesService {
  async submitArticle(data: { userId: number, descripcionCatalogo: string, descripcionCompleta: string, fotosBase64?: string[], categoria: string }) {
    // Verificamos si el usuario es dueño
    let duenio = await prisma.duenios.findUnique({
      where: { identificador: data.userId }
    });

    if (!duenio) {
      // Si no es dueño, lo creamos asignándole un revisor por defecto (ej: empleado 1)
      const empleado = await prisma.empleados.findFirst({
        where: { cargo: { contains: 'Revisor' } }
      });

      if (!empleado) throw new Error('No hay revisores disponibles en el sistema');

      duenio = await prisma.duenios.create({
        data: {
          identificador: data.userId,
          verificacionFinanciera: 'no',
          verificacionJudicial: 'no',
          calificacionRiesgo: 3,
          verificador: empleado.identificador
        }
      });
    }

    const revisor = await prisma.empleados.findFirst({
      where: { cargo: { contains: 'Revisor' } }
    });

    if (!revisor) throw new Error('No hay revisores disponibles en el sistema');

    const seguro = await prisma.seguros.findFirst();

    // Creamos el producto
    const producto = await prisma.productos.create({
      data: {
        fecha: new Date(),
        disponible: 'no', // Empieza como no disponible hasta ser revisado
        descripcionCatalogo: data.descripcionCatalogo,
        descripcionCompleta: data.descripcionCompleta,
        revisor: revisor.identificador,
        duenio: duenio.identificador,
        seguro: seguro ? seguro.nroPoliza : undefined
      }
    });

    if (data.fotosBase64 && data.fotosBase64.length > 0) {
      for (const f of data.fotosBase64) {
        await prisma.fotos.create({
          data: {
            producto: producto.identificador,
            foto: Buffer.from(f, 'base64')
          }
        });
      }
    }

    await prisma.extra_solicitudesVenta.create({
      data: { cliente: data.userId, producto: producto.identificador, estado: 'pendiente', categoria: data.categoria }
    });

    return producto;
  }

  async deleteArticle(productoId: number, userId: number) {
    const producto = await prisma.productos.findUnique({
      where: { identificador: productoId },
      include: { itemsCatalogo: true },
    });

    if (!producto) throw new Error('Artículo no encontrado');
    if (producto.duenio !== userId) throw new Error('No tenés permiso para eliminar este artículo');
    if (producto.itemsCatalogo.length > 0) throw new Error('No se puede eliminar un artículo que ya fue aprobado o incluido en subasta');

    await prisma.fotos.deleteMany({ where: { producto: productoId } });
    await prisma.registroDeSubasta.deleteMany({ where: { producto: productoId } });
    await prisma.extra_solicitudesVenta.deleteMany({ where: { producto: productoId } });
    await prisma.productos.delete({ where: { identificador: productoId } });
  }

  async aceptarPropuesta(productoId: number, userId: number) {
    const solicitud = await prisma.extra_solicitudesVenta.findUnique({
      where: { producto: productoId },
      include: { productos: true }
    });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (solicitud.productos.duenio !== userId) throw new Error('No tenés permiso');
    if (solicitud.estado !== 'aprobado') throw new Error('La solicitud no está en estado aprobado');

    await prisma.extra_solicitudesVenta.update({
      where: { producto: productoId },
      data: { estado: 'a_subastar', fechaActualizacion: new Date() }
    });
  }

  async aprobarSolicitud(productoId: number, precioBase: number, comision: number) {
    const solicitud = await prisma.extra_solicitudesVenta.findUnique({
      where: { producto: productoId },
      include: { productos: true }
    });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (solicitud.estado !== 'pendiente') throw new Error('La solicitud no está en estado pendiente');

    await prisma.extra_solicitudesVenta.update({
      where: { producto: productoId },
      data: { estado: 'aprobado', precioBase, comision, fechaActualizacion: new Date() }
    });

    const titulo = solicitud.productos?.descripcionCatalogo ?? 'tu artículo';
    const precioFmt = precioBase.toLocaleString('es-AR');
    const comisionPct = (comision * 100).toFixed(0);
    await prisma.notificaciones.create({
      data: {
        identificadorPersona: solicitud.cliente,
        mensaje: `OFERTA-REF-${productoId} Tu artículo "${titulo}" fue aprobado. Revisá el precio base ($${precioFmt}) y la comisión (${comisionPct}%) en Mis Ventas y respondé para continuar.`
      }
    });
  }

  async rechazarPropuestaVendedor(productoId: number, userId: number) {
    const solicitud = await prisma.extra_solicitudesVenta.findUnique({
      where: { producto: productoId },
      include: { productos: true }
    });
    if (!solicitud) throw new Error('Solicitud no encontrada');
    if (solicitud.productos.duenio !== userId) throw new Error('No tenés permiso');
    if (solicitud.estado !== 'aprobado') throw new Error('La solicitud no está en estado aprobado');

    await prisma.extra_solicitudesVenta.update({
      where: { producto: productoId },
      data: { estado: 'rechazado', motivo: 'Propuesta rechazada por el consignante', fechaActualizacion: new Date() }
    });
  }

  async getMyArticles(userId: number) {
    const productos = await prisma.productos.findMany({
      where: { duenio: userId },
      orderBy: { identificador: 'desc' },
      include: {
        fotos: { take: 1 },
        extra_solicitudesVenta: true,
        itemsCatalogo: {
          include: {
            catalogos: {
              include: { subastas: true }
            }
          }
        }
      }
    });

    // Auto-notificar cambios de estado que el admin hizo directamente en la BD
    for (const p of productos) {
      const sol = p.extra_solicitudesVenta as any;
      if (!sol) continue;

      if (sol.estado === 'aprobado' && sol.precioBase != null && sol.comision != null) {
        const ref = `OFERTA-REF-${p.identificador}`;
        const existe = await prisma.notificaciones.findFirst({
          where: { identificadorPersona: userId, mensaje: { startsWith: ref } }
        });
        if (!existe) {
          const titulo = p.descripcionCatalogo ?? 'tu artículo';
          const precioFmt = Number(sol.precioBase).toLocaleString('es-AR');
          const comisionPct = (Number(sol.comision) * 100).toFixed(0);
          await prisma.notificaciones.create({
            data: {
              identificadorPersona: userId,
              mensaje: `${ref} Tu artículo "${titulo}" fue aprobado. Revisá el precio base ($${precioFmt}) y la comisión (${comisionPct}%) en Mis Ventas y respondé para continuar.`
            }
          });
        }
      }

      if (
        sol.estado === 'rechazado' &&
        sol.motivo &&
        sol.motivo !== 'Propuesta rechazada por el consignante'
      ) {
        const ref = `RECHAZO-REF-${p.identificador}`;
        const existe = await prisma.notificaciones.findFirst({
          where: { identificadorPersona: userId, mensaje: { startsWith: ref } }
        });
        if (!existe) {
          const titulo = p.descripcionCatalogo ?? 'tu artículo';
          await prisma.notificaciones.create({
            data: {
              identificadorPersona: userId,
              mensaje: `${ref} Tu artículo "${titulo}" fue rechazado por nuestro equipo. Motivo: ${sol.motivo}`
            }
          });
        }
      }
    }

    return productos.map((p) => {
      const fotoRaw = (p.fotos[0] as any)?.foto;
      const portada = fotoRaw ? fotoABase64(fotoRaw) : null;
      const { fotos, ...resto } = p as any;
      return { ...resto, portada };
    });
  }
}

export const articlesService = new ArticlesService();
