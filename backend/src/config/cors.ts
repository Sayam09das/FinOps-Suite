import cors from 'cors';

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');

const allowedOrigins = (
  process.env.FRONTEND_URLS ??
  process.env.FRONTEND_URL ??
  'http://localhost:3000,https://finops-suite.vercel.app,https://fin-ops-suite.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

export const corsOptions = {
  origin: (origin: string | undefined, callback: CorsOriginCallback) => {
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(normalizeOrigin(origin))) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

export const corsMiddleware = cors(corsOptions);
