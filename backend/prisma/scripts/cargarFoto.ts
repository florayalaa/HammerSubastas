import { PrismaClient } from '@prisma/client';

// Para ejecutar este script hay dos formas:
// Forma 1: npx ts-node prisma/scripts/cargarFoto.ts
// Forma 2: tsx prisma/scripts/cargarFoto.ts

const prisma = new PrismaClient();

async function main() {

  const response = await fetch(
    'https://www.tumundoantiguo.com/wp-content/uploads/2019/03/IMG_3644.jpg'
  );

  const buffer = Buffer.from(
    await response.arrayBuffer()
  );
/* Elegi si queres crear o update, la tabla y cambia los campos 
  await prisma.fotos.create({
    data: {
      producto: 1,
      foto: buffer
    }
  });
*/
  await prisma.fotos.update({
    where: {
      identificador: 4
    },
    data: {
      foto: buffer
    }
  });

  console.log('Imagen descargada y guardada');
}

main();