import './loadEnv';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().default('finops-access-secret'),
  JWT_REFRESH_SECRET: z.string().default('finops-refresh-secret'),
  FRONTEND_URL: z.string().url().optional(),
  FRONTEND_URLS: z.string().optional(),
  ADMIN_EMAILS: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
});

export const env = envSchema.parse(process.env);

export type Env = typeof env;
