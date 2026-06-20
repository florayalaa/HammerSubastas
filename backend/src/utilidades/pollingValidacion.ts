import bcrypt from 'bcrypt';
import { prisma } from '../configuracion/baseDatos';
import { sendTemporaryPasswordEmail } from './correo';

async function procesarValidadosSinMail() {
  const pendientes = await prisma.extra_credencialesCliente.findMany({
    where: { estadoCredencial: 'validado', mailEnviado: false },
    include: { clientes: { include: { personas: true } } },
  });

  for (const cred of pendientes) {
    try {
      const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      const passwordHash = await bcrypt.hash(tempCode, 10);

      await prisma.clientes.update({
        where: { identificador: cred.cliente },
        data: { admitido: 'si' },
      });

      const nombre = cred.clientes.personas?.nombre ?? '';
      await sendTemporaryPasswordEmail(cred.email, tempCode, nombre);

      await prisma.extra_credencialesCliente.update({
        where: { identificador: cred.identificador },
        data: { passwordHash, mailEnviado: true },
      });

      console.log(`Mail de validación enviado a ${cred.email}`);
    } catch (err) {
      console.error(`Error al procesar validación para ${cred.email}:`, err);
    }
  }
}

export function iniciarPollingValidacion(intervaloMs = 10000) {
  setInterval(procesarValidadosSinMail, intervaloMs);
  console.log('Polling de validación iniciado');
}
