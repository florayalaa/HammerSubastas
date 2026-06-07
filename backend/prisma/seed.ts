import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Empezando el seeding de la base de datos...');

  // Limpiar tablas modernas
  await prisma.bid.deleteMany();
  await prisma.catalogItem.deleteMany();
  await prisma.auctionAttendee.deleteMany();
  await prisma.auction.deleteMany();
  await prisma.paymentMethod.deleteMany();
  await prisma.itemSubmission.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  // Limpiar tablas legacy (en orden por foreign keys)
  await prisma.pujos.deleteMany();
  await prisma.asistentes.deleteMany();
  await prisma.registroDeSubasta.deleteMany();
  await prisma.itemsCatalogo.deleteMany();
  await prisma.catalogos.deleteMany();
  await prisma.subastas.deleteMany();
  await prisma.subastadores.deleteMany();
  await prisma.fotos.deleteMany();
  await prisma.productos.deleteMany();
  await prisma.duenios.deleteMany();
  await prisma.clientes.deleteMany();
  await prisma.empleados.deleteMany();
  await prisma.sectores.deleteMany();
  await prisma.credenciales_web.deleteMany();
  await prisma.notificaciones_web.deleteMany();
  await prisma.personas.deleteMany();
  await prisma.paises.deleteMany();
  await prisma.seguros.deleteMany();

  console.log('Tablas limpiadas exitosamente.');

  // === 1. Creación de datos básicos (Países, Sectores, Seguros) ===
  const pais = await prisma.paises.create({
    data: {
      numero: 1,
      nombre: 'Argentina',
      nombreCorto: 'ARG',
      capital: 'Buenos Aires',
      nacionalidad: 'Argentino',
      idiomas: 'Español'
    }
  });

  const sectorRevisores = await prisma.sectores.create({
    data: { nombreSector: 'Revisores', codigoSector: 'REV' }
  });

  const sectorSubastadores = await prisma.sectores.create({
    data: { nombreSector: 'Subastadores', codigoSector: 'SUB' }
  });

  const seguroBase = await prisma.seguros.create({
    data: {
      nroPoliza: 'POL-123456',
      compania: 'Seguros La Segunda',
      polizaCombinada: 'si',
      importe: 50000.00
    }
  });

  // === 2. Creación de Personas y Empleados ===
  const personaEmpleado1 = await prisma.personas.create({
    data: { documento: '11111111', nombre: 'Juan Revisor', direccion: 'Calle Falsa 123', estado: 'activo' }
  });

  const empleadoRevisor = await prisma.empleados.create({
    data: {
      identificador: personaEmpleado1.identificador,
      cargo: 'Revisor de Arte',
      sector: sectorRevisores.identificador
    }
  });

  const personaEmpleado2 = await prisma.personas.create({
    data: { documento: '22222222', nombre: 'Ana Subastadora', direccion: 'Av. Siempreviva 742', estado: 'activo' }
  });

  const empleadoSubastador = await prisma.empleados.create({
    data: {
      identificador: personaEmpleado2.identificador,
      cargo: 'Subastador Principal',
      sector: sectorSubastadores.identificador
    }
  });

  const subastadorRol = await prisma.subastadores.create({
    data: {
      identificador: personaEmpleado2.identificador,
      matricula: 'MAT-789',
      region: 'CABA'
    }
  });

  // === 3. Creación de Clientes/Usuarios ===
  const passwordHash = await bcrypt.hash('password123', 10);

  const personaUser = await prisma.personas.create({
    data: {
      documento: '33333333',
      nombre: 'Usuario Comprador',
      direccion: 'Av. Corrientes 1000',
      estado: 'activo',
      credenciales: {
        create: {
          email: 'user@test.com',
          passwordHash: passwordHash,
          mustChangePassword: false
        }
      }
    }
  });

  const clienteRol = await prisma.clientes.create({
    data: {
      identificador: personaUser.identificador,
      numeroPais: pais.numero,
      admitido: 'si',
      categoria: 'Plata',
      verificador: empleadoRevisor.identificador
    }
  });

  const duenioRol = await prisma.duenios.create({
    data: {
      identificador: personaUser.identificador,
      numeroPais: pais.numero,
      verificacionFinanciera: 'si',
      verificacionJudicial: 'si',
      calificacionRiesgo: 1,
      verificador: empleadoRevisor.identificador
    }
  });

  // DUPLICATE IN NEW MODERN 'User' TABLE
  const modernUser = await prisma.user.create({
    data: {
      id: personaUser.identificador.toString(), // Keep IDs in sync if possible, or let UUID auto-generate
      firstName: 'Usuario',
      lastName: 'Comprador',
      email: 'user@test.com',
      passwordHash: passwordHash,
      country: 'Argentina',
      address: 'Av. Corrientes 1000',
      category: 'Plata',
      isApproved: true,
      mustChangePassword: false
    }
  });

  // === 4. Creación de Productos y Subastas ===
  const producto1 = await prisma.productos.create({
    data: {
      fecha: new Date(),
      disponible: 'si',
      descripcionCatalogo: 'Cuadro Antiguo del Siglo XVIII',
      descripcionCompleta: 'Cuadro original restaurado con marco de roble.',
      revisor: empleadoRevisor.identificador,
      duenio: duenioRol.identificador,
      seguro: seguroBase.nroPoliza
    }
  });

  const producto2 = await prisma.productos.create({
    data: {
      fecha: new Date(),
      disponible: 'si',
      descripcionCatalogo: 'Reloj de Bolsillo de Oro',
      descripcionCompleta: 'Reloj marca Patek Philippe de 1920, bañado en oro.',
      revisor: empleadoRevisor.identificador,
      duenio: duenioRol.identificador,
      seguro: seguroBase.nroPoliza
    }
  });

  // Crear fotos simuladas (como bytes vacíos o un pequeño buffer para prueba)
  await prisma.fotos.create({
    data: { producto: producto1.identificador, foto: Buffer.from('dummy_image_data_1') }
  });
  await prisma.fotos.create({
    data: { producto: producto2.identificador, foto: Buffer.from('dummy_image_data_2') }
  });

  const subastaLegacy = await prisma.subastas.create({
    data: {
      fecha: new Date(),
      hora: new Date(),
      estado: 'abierta',
      subastador: subastadorRol.identificador,
      ubicacion: 'Sala Virtual 1',
      capacidadAsistentes: 100,
      tieneDeposito: 'si',
      seguridadPropia: 'no',
      categoria: 'Arte'
    }
  });

  const catalogo = await prisma.catalogos.create({
    data: {
      descripcion: 'Gran Subasta de Arte y Relojes',
      subasta: subastaLegacy.identificador,
      responsable: empleadoRevisor.identificador
    }
  });

  const itemCat1 = await prisma.itemsCatalogo.create({
    data: {
      catalogo: catalogo.identificador,
      producto: producto1.identificador,
      precioBase: 1500.00,
      comision: 10.00,
      subastado: 'no'
    }
  });

  const itemCat2 = await prisma.itemsCatalogo.create({
    data: {
      catalogo: catalogo.identificador,
      producto: producto2.identificador,
      precioBase: 3500.00,
      comision: 10.00,
      subastado: 'no'
    }
  });

  // DUPLICATE IN NEW MODERN 'Auction' TABLE
  const modernAuction = await prisma.auction.create({
    data: {
      title: 'Gran Subasta de Arte y Relojes',
      description: 'Subasta especial de artefactos antiguos y de colección.',
      startingPrice: 1500.00,
      currentPrice: 1500.00,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // En 7 días
      status: 'ACTIVE'
    }
  });

  const modernCatalogItem1 = await prisma.catalogItem.create({
    data: {
      auctionId: modernAuction.id,
      title: 'Cuadro Antiguo del Siglo XVIII',
      description: 'Cuadro original restaurado con marco de roble.',
      startingPrice: 1500.00,
      currentPrice: 1500.00,
      status: 'ACTIVE'
    }
  });

  const modernCatalogItem2 = await prisma.catalogItem.create({
    data: {
      auctionId: modernAuction.id,
      title: 'Reloj de Bolsillo de Oro',
      description: 'Reloj marca Patek Philippe de 1920, bañado en oro.',
      startingPrice: 3500.00,
      currentPrice: 3500.00,
      status: 'ACTIVE'
    }
  });

  console.log('Seeding completado con éxito!');
  console.log(`Usuario creado: user@test.com / password123`);
  console.log(`Subasta creada (Modern ID): ${modernAuction.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
