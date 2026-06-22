require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'encontrada ✓' : 'NO encontrada ✗');

  const subastas = await prisma.subastas.findMany({ take: 5 });
  console.log('Subastas:', subastas);

  const categorias = await prisma.subastas.findMany({
    where: { categoria: { not: null } },
    select: { identificador: true, categoria: true },
  });
  console.log('Categorías:', categorias);
}

check()
  .catch((e) => console.error('Error de conexión:', e))
  .finally(() => prisma.$disconnect());
