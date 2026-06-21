import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const metodosVerificados = await prisma.extra_metodosPago.findMany({
    where: { estado: 'verificado' },
  });

  console.log(`Métodos verificados encontrados: ${metodosVerificados.length}`);

  let creadas = 0;
  for (const m of metodosVerificados) {
    const etiqueta =
      m.tipo === 'tarjeta' ? 'tarjeta' :
      m.tipo === 'cheque'  ? `cheque (Nº ${m.numero})` :
      'cuenta bancaria';

    await prisma.notificaciones.create({
      data: {
        identificadorPersona: m.cliente,
        mensaje: `Tu ${etiqueta} fue verificada exitosamente.`,
        leido: true,
      },
    });
    creadas++;
    console.log(`  → Notificación creada para cliente ${m.cliente} (${etiqueta})`);
  }

  console.log(`\nListo. ${creadas} notificaciones creadas.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
