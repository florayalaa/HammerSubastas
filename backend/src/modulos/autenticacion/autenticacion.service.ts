import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../configuracion/baseDatos';
import { sendTemporaryPasswordEmail } from '../../utilidades/correo';

const EMPLEADO_DEFAULT = 1;

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

  async register(data: any, files?: { fotoFrente?: Buffer; fotoDorso?: Buffer }) {
    const existingCreds = await prisma.extra_credencialesCliente.findUnique({
      where: { email: data.email },
    });

    if (existingCreds) {
      throw new Error('El email ya está registrado');
    }

    const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const passwordHash = await bcrypt.hash(tempCode, 10);
    const nombre = `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Usuario';

    const persona = await prisma.personas.create({
      data: {
        documento: data.documento || (Math.floor(Math.random() * 100000000)).toString(),
        nombre,
        direccion: data.address || '',
        estado: 'activo',
        clientes: {
          create: {
            verificador: EMPLEADO_DEFAULT,
            admitido: 'no',
            numeroPais: data.numeroPais ? parseInt(data.numeroPais) : null,
            extra_credencialesCliente: {
              create: {
                email: data.email,
                passwordHash,
                debeCambiarClave: 'si',
              },
            },
          },
        },
      },
      include: {
        clientes: {
          include: { extra_credencialesCliente: true },
        },
      },
    });

    if (files?.fotoFrente && files?.fotoDorso) {
      await prisma.extra_documentosCliente.create({
        data: {
          cliente: persona.identificador,
          fotoFrente: files.fotoFrente,
          fotoDorso: files.fotoDorso,
        },
      });
    }

    await sendTemporaryPasswordEmail(data.email, tempCode, nombre);

    return {
      message: 'Solicitud enviada. Tu cuenta será verificada y recibirás una contraseña temporal por email.',
      user: { id: persona.identificador, email: data.email, name: persona.nombre },
    };
  }

  async login(data: any) {
    const creds = await prisma.extra_credencialesCliente.findUnique({
      where: { email: data.email },
      include: {
        clientes: {
          include: {
            personas: true,
            extra_metodosPago: { where: { estado: 'verificado' } },
          },
        },
      },
    });

    if (!creds) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, creds.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    if (creds.debeCambiarClave === 'si') {
      throw new Error('Debe completar el registro con su contraseña temporal antes de iniciar sesión.');
    }

    const token = this.generateToken(creds.clientes, creds.email);

    const nombreCompleto = creds.clientes.personas?.nombre ?? '';
    const partes = nombreCompleto.split(' ');
    const firstName = partes[0] ?? '';
    const lastName = partes.slice(1).join(' ');

    const catMap: Record<string, string> = {
      comun: 'Común', común: 'Común',
      especial: 'Especial',
      plata: 'Plata',
      oro: 'Oro',
      platino: 'Platino',
    };
    const category = catMap[(creds.clientes.categoria ?? '').toLowerCase()] ?? 'Común';

    return {
      user: {
        id: creds.clientes.identificador,
        firstName,
        lastName,
        email: creds.email,
        category,
        verified: creds.clientes.admitido === 'si',
        hasPaymentMethods: creds.clientes.extra_metodosPago.length > 0,
      },
      token,
    };
  }

  async completeRegistration(data: any) {
    const creds = await prisma.extra_credencialesCliente.findUnique({
      where: { email: data.email },
    });

    if (!creds) {
      throw new Error('Usuario no encontrado');
    }

    if (creds.debeCambiarClave !== 'si') {
      throw new Error('Este usuario ya completó su registro');
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.extra_credencialesCliente.update({
      where: { identificador: creds.identificador },
      data: {
        passwordHash: newPasswordHash,
        debeCambiarClave: 'no',
      },
    });

    return { message: 'Registro completado y contraseña actualizada exitosamente.' };
  }

  private generateToken(cliente: any, email: string) {
    return jwt.sign(
      {
        id: cliente.identificador.toString(),
        email,
        category: cliente.categoria || 'comun',
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
