export const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:5001';

export const nextAuthSecret =
  process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '';

export const googleClientId =
  process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID || '';
export const googleClientSecret =
  process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET || '';

export const appleClientId =
  process.env.AUTH_APPLE_ID || process.env.APPLE_CLIENT_ID || '';
export const appleClientSecret =
  process.env.AUTH_APPLE_SECRET || process.env.APPLE_CLIENT_SECRET || '';

export const facebookClientId =
  process.env.AUTH_FACEBOOK_ID || process.env.FACEBOOK_CLIENT_ID || '';
export const facebookClientSecret =
  process.env.AUTH_FACEBOOK_SECRET || process.env.FACEBOOK_CLIENT_SECRET || '';
