import { prisma } from '../../configuracion/baseDatos';

export class ArticlesService {
  async submitArticle(data: { userId: number, descripcionCatalogo: string, descripcionCompleta: string, fotosBase64?: string[] }) {
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
      data: { cliente: data.userId, producto: producto.identificador, estado: 'pendiente' }
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

    return productos.map((p) => {
      const fotoRaw = (p.fotos[0] as any)?.foto;
      const portada = fotoRaw
        ? `data:image/jpeg;base64,${Buffer.from(fotoRaw).toString('base64')}`
        : null;
      const { fotos, ...resto } = p as any;
      return { ...resto, portada };
    });
  }
}

export const articlesService = new ArticlesService();
