export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL!,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
  NEXT_PUBLIC_SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL || process.env.NEXT_PUBLIC_API_URL!,
  
  // OAuth
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  NEXT_PUBLIC_GITHUB_CLIENT_ID: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
  
  // Cloudinary (uploads)
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  
  // Mode
  NODE_ENV: process.env.NODE_ENV!,
} as const

// Runtime validation
export const isDev = env.NODE_ENV === "development"
export const isProd = env.NODE_ENV === "production"

