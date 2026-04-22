import cors from 'cors';

const normalizeOrigin = (origin: string): string => origin.replace(/\/+$/, '');

const allowedOrigins = (
  process.env.FRONTEND_URLS ??
  process.env.FRONTEND_URL ??
  'http://localhost:3000,http://localhost:3001,https://finops-suite.vercel.app,https://fin-ops-suite.vercel.app'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

type CorsOriginCallback = (error: Error | null, allow?: boolean) => void;

export const corsOptions = {
  origin: (origin: string | undefined, callback: CorsOriginCallback) => {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) {
      callback(null, true);
      return;
    }

    const normalizedOrigin = normalizeOrigin(origin);
    
    if (allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
      return;
    }

    console.warn(`CORS rejected origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true, // CRITICAL: Allow cookies to be sent/received
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie', 'X-Requested-With'],
  exposedHeaders: ['Content-Length', 'X-JSON-Response-Type', 'Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

export const corsMiddleware = cors(corsOptions);
