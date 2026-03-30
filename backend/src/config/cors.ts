import cors from 'cors';

export const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
