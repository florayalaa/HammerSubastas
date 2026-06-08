import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';
import nodemailer from 'nodemailer';

//ESTRUCTURA EN MEMORIA RAM (Sin tocar la Base de Datos)
// Guarda: "email" -> { pinCode: "123456", expiresAt: timestamp }
const recoveryCache = new Map<string, { pinCode: string; expiresAt: number }>();

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

  private async sendMailTemplate(to: string, subject: string, htmlContent: string) {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    const info = await transporter.sendMail({
      from: '"Subastas Universitarias" <no-reply@subastas.com>',
      to,
      subject,
      html: htmlContent,
    });
    console.log(`\n📬 [MAIL DE PRUEBA SENT] Link de inspección: ${nodemailer.getTestMessageUrl(info)}\n`);
  }

  async register(data: any) {
    // Validamos de forma única y definitiva sobre la tabla credenciales
    const emailEnUso = await prisma.credenciales_web.findUnique({ where: { email: data.email } });

    if (emailEnUso) {
      throw new Error('El correo electrónico ya se encuentra registrado o en proceso de revisión.');
    }

    const frenteBuffer = Buffer.from(data.documentFront, 'base64');
    const dorsoBuffer = Buffer.from(data.documentBack, 'base64');

    // Transacción atómica: Creamos la persona y su credencial inicial sin contraseña
    const nuevaPersona = await prisma.$transaction(async (tx) => {
      const persona = await tx.personas.create({
        data: {
          documento: data.documento || Math.floor(10000000 + Math.random() * 90000000).toString(),
          nombre: `${data.firstName} ${data.lastName}`.trim(),
          direccion: `${data.address} | País: ${data.country}`.trim(),
          estado: 'incativo', // Sigue inactivo hasta que el admin lo apruebe
          documentos: {
            create: {
              frente: frenteBuffer,
              dorso: dorsoBuffer,
            },
          },
        },
      });

      //Guardamos el email acá por ÚNICA VEZ. El passwordHash queda en NULL.
      await tx.credenciales_web.create({
        data: {
          identificador: persona.identificador,
          email: data.email,
          passwordHash: null, 
          mustChangePassword: true,
        },
      });

      return persona;
    });

    return { 
      message: 'Registro exitoso. Tu solicitud quedó en proceso de revisión.', 
      user: { id: nuevaPersona.identificador, email: data.email, name: nuevaPersona.nombre } 
    };
  }

  async approvePostor(adminData: { personaId: number; categoria: 'comun' | 'especial' | 'plata' | 'oro' | 'platino'; verificadorEmpleadoId: number }) {
    const persona = await prisma.personas.findUnique({
      where: { identificador: adminData.personaId },
      include: { credenciales: true },
    });

    if (!persona) throw new Error('La persona especificada no existe.');
    if (!persona.credenciales) throw new Error('La persona no cuenta con un registro de credenciales asociado.');
    if (persona.credenciales.passwordHash !== null) {
      throw new Error('Este usuario ya fue aprobado y posee una contraseña asignada.');
    }

    // Lógica inteligente para aislar el país de la dirección
    let numeroPaisFinal = 1;
    if (persona.direccion && persona.direccion.includes('| País: ')) {
      const countryName = persona.direccion.split('| País: ')[1]?.trim();
      const paisEncontrado = await prisma.paises.findFirst({
        where: { nombre: { contains: countryName } }
      });
      if (paisEncontrado) numeroPaisFinal = paisEncontrado.numero;
    }

    // Generar contraseña temporal aleatoria
    const tempPassword = Math.random().toString(36).substring(2, 8).toUpperCase();
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // Transacción limpia para activar al usuario y asignarle su clave temporal
    await prisma.$transaction([
      prisma.personas.update({
        where: { identificador: adminData.personaId },
        data: { estado: 'activo' },
      }),
      prisma.clientes.create({
        data: {
          identificador: adminData.personaId,
          numeroPais: numeroPaisFinal,
          admitido: 'si',
          categoria: adminData.categoria,
          verificador: adminData.verificadorEmpleadoId,
        },
      }),
      //ACTUALIZAMOS la fila que creamos en el registro
      prisma.credenciales_web.update({
        where: { identificador: adminData.personaId },
        data: {
          passwordHash: passwordHash,
          mustChangePassword: true,
        },
      }),
    ]);

    try {
      await this.sendMailTemplate(
        persona.credenciales.email,
        '¡Tu cuenta de Postor ha sido admitida!',
        `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>¡Hola, ${persona.nombre}!</h2>
          <p>Tu solicitud fue aprobada. Iniciá sesión con tu correo y esta contraseña provisoria:</p>
          <div style="background-color: #f4f4f4; padding: 10px; font-size: 20px; font-weight: bold; color: #007bff; display: inline-block;">${tempPassword}</div>
          <p style="color: red; margin-top: 15px;">⚠️ Se te solicitará cambiar esta clave de forma obligatoria al ingresar.</p>
        </div>`
      );
    } catch (mailError) {
      console.error('Error al despachar el mail:', mailError);
    }

    return { message: 'Postor aprobado con éxito. Notificación enviada al correo.' };
  }

  async login(data: any) {
    const creds = await prisma.credenciales_web.findUnique({
      where: { email: data.email },
      include: { personas: { include: { clientes: true } } },
    });

    // Si la credencial no existe, o existe pero no tiene passwordHash (aún no fue aprobado)
    if (!creds || !creds.passwordHash) {
      throw new Error('Credenciales inválidas o cuenta en proceso de revisión por el administrador.');
    }

    const isPasswordValid = await bcrypt.compare(data.password, creds.passwordHash);
    if (!isPasswordValid) throw new Error('Credenciales inválidas');

    const cliente = creds.personas.clientes;
    if (!cliente || cliente.admitido !== 'si') {
      throw new Error('Tu cuenta no se encuentra admitida para operar.');
    }

    // Forzar pantalla de cambio de clave si tiene el flag activo
    if (creds.mustChangePassword) {
      return { mustChangePassword: true, email: creds.email, message: 'Cambio de contraseña obligatorio.' };
    }

    const token = jwt.sign(
      { id: creds.identificador, email: creds.email, category: cliente.categoria || 'comun' },
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    return {
      user: { id: creds.identificador, name: creds.personas.nombre, email: creds.email, category: cliente.categoria },
      token,
    };
  }

  async completeRegistration(data: any) {
    const creds = await prisma.credenciales_web.findUnique({ where: { email: data.email } });

    if (!creds || !creds.passwordHash || !creds.mustChangePassword) {
      throw new Error('Petición inválida o el registro ya fue completado previamente.');
    }

    const isCodeValid = await bcrypt.compare(data.code, creds.passwordHash);
    if (!isCodeValid) throw new Error('La contraseña temporal ingresada es inválida.');

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.credenciales_web.update({
      where: { identificador: creds.identificador },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return { message: 'Contraseña definitiva establecida con éxito. Ya podés operar.' };
  }

  async requestPasswordReset(email: string) {
    const creds = await prisma.credenciales_web.findUnique({ where: { email } });
    
    // Si no existe u todavía no fue aprobado (no tiene contraseña), denegamos el envío
    if (!creds || !creds.passwordHash) {
      return { message: 'Si el correo está registrado, se enviará un código de verificación.' };
    }

    const pinCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 15 * 60 * 1000;

    recoveryCache.set(email, { pinCode, expiresAt });

    try {
      await this.sendMailTemplate(
        email,
        'Código de verificación de seguridad',
        `<div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Código de recuperación:</h2>
          <div style="background-color: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; color: #28a745; display: inline-block;">
            ${pinCode}
          </div>
        </div>`
      );
    } catch (mailError) {
      console.error('Error enviando el OTP:', mailError);
    }

    return { message: 'Código de verificación enviado al correo registrado con éxito.' };
  }

  async resetPassword(data: any) {
    // 1. Ir a buscar el código temporal a la RAM
    const cachedData = recoveryCache.get(data.email);

    if (!cachedData) {
      throw new Error('No se ha solicitado ninguna recuperación de contraseña o el código nunca se generó.');
    }

    // 2. Comprobar si ya pasaron los 15 minutos
    if (Date.now() > cachedData.expiresAt) {
      recoveryCache.delete(data.email); // Limpiamos la basura de la RAM
      throw new Error('El código de verificación ha expirado. Solicitá uno nuevo.');
    }

    // 3. Validar que los 6 números coincidan
    if (cachedData.pinCode !== data.code) {
      throw new Error('El código de verificación de 6 dígitos es incorrecto.');
    }

    // 4. Si todo está bien, impactamos la nueva clave en la DB
    const creds = await prisma.credenciales_web.findUnique({ where: { email: data.email } });
    if (!creds) throw new Error('Usuario no encontrado.');

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.credenciales_web.update({
      where: { identificador: creds.identificador },
      data: { passwordHash: newPasswordHash },
    });

    // 5. Consumido con éxito: lo barremos de la memoria para que no se pueda reutilizar
    recoveryCache.delete(data.email);

    return { message: 'Tu contraseña ha sido restablecida con éxito.' };
  }
}

export const authService = new AuthService();
