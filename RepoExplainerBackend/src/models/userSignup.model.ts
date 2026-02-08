import { z } from 'zod';

export const userValidationSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(8, 'Password must not be atleast 8 characters long'),
});
