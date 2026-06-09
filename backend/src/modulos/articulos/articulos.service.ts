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

    // Guardar fotos simuladas
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

    return producto;
  }

  async getMyArticles(userId: number) {
    const productos = await prisma.productos.findMany({
      where: { duenio: userId },
      include: {
        itemsCatalogo: {
          include: {
            catalogos: {
              include: { subastas: true }
            }
          }
        }
      }
    });
    return productos;
  }
}

export const articlesService = new ArticlesService();
