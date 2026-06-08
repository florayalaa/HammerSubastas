import { z } from 'zod';

// Etapa 1: Registro del Postor
export const registerSchema = z.object({
  firstName: z.string().min(1, 'El nombre es obligatorio'),
  lastName: z.string().min(1, 'El apellido es obligatorio'),
  email: z.string().email('Correo electrónico no válido'),
  address: z.string().min(1, 'El domicilio legal es obligatorio'),
  country: z.string().min(1, 'El país de origen es obligatorio'),
  documentFront: z.string().min(1, 'La foto de frente del DNI es obligatoria'),
  documentBack: z.string().min(1, 'La foto de dorso del DNI es obligatoria'),
  documento: z.string().optional(), // Opcional
});

// Inicio de Sesión
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

// Etapa 2: Cambio obligatorio de contraseña (Primer Ingreso)
export const completeRegistrationSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().min(1, 'La contraseña temporal es requerida'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

// Aprobación Manual del Administrador (Back-office)
export const approvePostorSchema = z.object({
  personaId: z.number().int().positive('ID de persona inválido'),
  categoria: z.enum(['comun', 'especial', 'plata', 'oro', 'platino']),
  verificadorEmpleadoId: z.number().int().positive('ID de empleado inválido'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('Email no válido'),
  code: z.string().length(6, 'El código debe tener 6 números'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});
