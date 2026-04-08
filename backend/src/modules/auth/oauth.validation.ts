import { z } from 'zod';

export const oauthSchema = z.object({
  email: z.string().email('Invalid email').transform((v) => v.toLowerCase().trim()),
  name: z.string().min(1, 'Name required').max(100),
  provider: z.enum(['google', 'apple', 'facebook']),
  providerId: z.string().min(1, 'Provider ID required'), // OAuth sub/id
}).strict();

