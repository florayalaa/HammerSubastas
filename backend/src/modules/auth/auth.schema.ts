import { z } from 'zod';

export const registerSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  country: z.string().min(2, 'El país es requerido'),
  address: z.string().min(5, 'La dirección es requerida'),
});

export const completeRegistrationSchema = z.object({
  email: z.string().email('Email inválido'),
  code: z.string().min(1, 'El código es requerido'),
  newPassword: z.string().min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});
