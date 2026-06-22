import { prisma } from '../../configuracion/baseDatos';

export class UsersService {
  async getUserProfile(userId: string) {
    const id = parseInt(userId, 10);
    const persona = await prisma.personas.findUnique({
      where: { identificador: id },
      include: {
        clientes: {
          include: {
            extra_credencialesCliente: true,
            paises: true,
          },
        },
      },
    });

    if (!persona) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: persona.identificador.toString(),
      firstName: persona.nombre.split(' ')[0] || '',
      lastName: persona.nombre.split(' ').slice(1).join(' ') || '',
      email: persona.clientes?.extra_credencialesCliente?.email ?? '',
      numeroPais: persona.clientes?.numeroPais ?? null,
      country: persona.clientes?.paises?.nombre || '',
      address: persona.direccion || '',
      category: persona.clientes?.categoria || 'comun',
      isApproved: persona.clientes?.admitido === 'si',
      foto: persona.foto ? Buffer.from(persona.foto).toString('base64') : null,
      documentFront: persona.foto ? 'base64-image' : null,
      documentBack: null,
      createdAt: persona.clientes?.extra_credencialesCliente?.fechaRegistro?.toISOString().split('T')[0] ?? null,
    };
  }

  async updateProfile(userId: string, data: any) {
    const id = parseInt(userId, 10);

    const personaData: any = {
      nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim(),
      direccion: data.address || null,
    };
    if (data.foto) {
      personaData.foto = Buffer.from(data.foto, 'base64');
    }

    const persona = await prisma.personas.update({
      where: { identificador: id },
      data: personaData,
      include: {
        clientes: { include: { extra_credencialesCliente: true, paises: true } },
      },
    });

    if (data.numeroPais) {
      await prisma.clientes.update({
        where: { identificador: id },
        data: { numeroPais: parseInt(data.numeroPais) },
      });
    }

    return {
      id: persona.identificador.toString(),
      firstName: persona.nombre.split(' ')[0] || '',
      lastName: persona.nombre.split(' ').slice(1).join(' ') || '',
      email: persona.clientes?.extra_credencialesCliente?.email ?? '',
      numeroPais: data.numeroPais ?? persona.clientes?.numeroPais,
      country: persona.clientes?.paises?.nombre || '',
      address: persona.direccion || '',
      category: persona.clientes?.categoria || 'comun',
    };
  }

  async uploadDocuments(userId: string, frontUrl: string, backUrl: string) {
    return { message: "Simulación de subida de documento completa." };
  }

  async getUserStats(userId: string) {
    const id = parseInt(userId, 10);

    const [pujasTotales, pujasGanadas, sumaGanadas, sumaTotales, asistencias] = await Promise.all([
      prisma.pujos.count({ where: { asistentes: { cliente: id } } }),
      prisma.pujos.count({ where: { asistentes: { cliente: id }, ganador: 'si' } }),
      prisma.pujos.aggregate({
        where: { asistentes: { cliente: id }, ganador: 'si' },
        _sum: { importe: true },
      }),
      prisma.pujos.aggregate({
        where: { asistentes: { cliente: id } },
        _sum: { importe: true },
      }),
      prisma.asistentes.findMany({
        where: { cliente: id },
        distinct: ['subasta'],
        select: { subasta: true },
      }),
    ]);

    return {
      pujasTotales,
      pujasGanadas,
      subastasAsistidas: asistencias.length,
      totalInvertido: Number(sumaGanadas._sum.importe ?? 0),
      totalOfertado: Number(sumaTotales._sum.importe ?? 0),
    };
  }

  async getUserById(id: string) {
    return prisma.personas.findUnique({ where: { identificador: parseInt(id, 10) } });
  }

  async getUserCategory(id: string): Promise<string> {
    const cliente = await prisma.clientes.findUnique({ where: { identificador: parseInt(id, 10) }, select: { categoria: true } });
    if (!cliente) return 'comun';
    return cliente.categoria || 'comun';
  }
}

export const usersService = new UsersService();
