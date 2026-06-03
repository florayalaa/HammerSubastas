import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');

  const auctions = [
    {
      title: 'Subasta de Arte Contemporáneo',
      description: 'Colección exclusiva de pintores emergentes.',
      startingPrice: 5000,
      currentPrice: 5000,
      startDate: new Date(),
      endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // En 7 días
      status: 'ACTIVE',
    },
    {
      title: 'Antigüedades del Siglo XIX',
      description: 'Muebles y decoraciones con historia.',
      startingPrice: 12000,
      currentPrice: 12000,
      startDate: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000), // En 2 días
      endDate: new Date(new Date().getTime() + 9 * 24 * 60 * 60 * 1000),
      status: 'UPCOMING',
    },
    {
      title: 'Joyas y Relojes de Lujo',
      description: 'Rolex, Cartier y piezas únicas.',
      startingPrice: 25000,
      currentPrice: 30000,
      startDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // Hace 2 días
      endDate: new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000), // En 1 día
      status: 'ACTIVE',
    }
  ];

  for (const auction of auctions) {
    await prisma.auction.create({
      data: auction
    });
  }

  console.log('Seed exitoso. Se insertaron 3 subastas de prueba.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
