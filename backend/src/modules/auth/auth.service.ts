import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/database';

export class AuthService {
  private readonly jwtSecret = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

  async register(data: any) {
    const existingCreds = await prisma.credenciales_web.findUnique({
      where: { email: data.email },
    });

    if (existingCreds) {
      throw new Error('El email ya está registrado');
    }

    // Generar código temporal de 6 caracteres
    const tempCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log(`\n\n========================================`);
    console.log(`[SIMULADOR DE EMAIL] Código temporal para ${data.email}: ${tempCode}`);
    console.log(`========================================\n\n`);

    const passwordHash = await bcrypt.hash(tempCode, 10);

    // Creamos la persona y sus credenciales
    const persona = await prisma.personas.create({
      data: {
        documento: data.documento || (Math.floor(Math.random() * 100000000)).toString(),
        nombre: `${data.firstName || ''} ${data.lastName || ''}`.trim() || 'Usuario Web',
        direccion: `${data.address || ''}, ${data.country || ''}`.trim(),
        estado: 'activo',
        credenciales: {
          create: {
            email: data.email,
            passwordHash: passwordHash,
            mustChangePassword: true,
          }
        }
      },
      include: {
        credenciales: true
      }
    });

    return { 
      message: 'Registro exitoso. Se ha enviado un código a su email.', 
      user: { id: persona.identificador, email: data.email, name: persona.nombre } 
    };
  }

  async login(data: any) {
    const creds = await prisma.credenciales_web.findUnique({
      where: { email: data.email },
      include: { personas: true }
    });

    if (!creds) {
      throw new Error('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(data.password, creds.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Credenciales inválidas');
    }

    if (creds.mustChangePassword) {
      throw new Error('Debe completar el registro con su código temporal antes de iniciar sesión.');
    }

    const token = this.generateToken(creds.personas, creds.email);

    return { 
      user: { id: creds.identificador, name: creds.personas.nombre, email: creds.email }, 
      token 
    };
  }

  async completeRegistration(data: any) {
    const creds = await prisma.credenciales_web.findUnique({
      where: { email: data.email },
    });

    if (!creds) {
      throw new Error('Usuario no encontrado');
    }

    if (!creds.mustChangePassword) {
      throw new Error('Este usuario ya completó su registro');
    }

    const isCodeValid = await bcrypt.compare(data.code, creds.passwordHash);

    if (!isCodeValid) {
      throw new Error('Código temporal inválido');
    }

    const newPasswordHash = await bcrypt.hash(data.newPassword, 10);

    await prisma.credenciales_web.update({
      where: { identificador: creds.identificador },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    return { message: 'Registro completado y contraseña actualizada exitosamente.' };
  }

  private generateToken(persona: any, email: string) {
    return jwt.sign(
      {
        id: persona.identificador,
        email: email,
        category: 'comun', // Default
      },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }
}

export const authService = new AuthService();
