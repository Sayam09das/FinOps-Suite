export const APP_NAME = 'FinOps Suite API';
export const API_VERSION = '1.0.0';

export const JWT = {
  ACCESS_EXPIRES: '15m',
  REFRESH_EXPIRES: '7d',
} as const;

export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
