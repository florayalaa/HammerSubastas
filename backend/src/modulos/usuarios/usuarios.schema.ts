import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  numeroPais: z.number().optional(),
  address: z.string().optional(),
  foto: z.string().optional(),
});
