import './loadEnv';
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const validateDatabaseUrl = (): void => {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from the backend environment.");
  }

  let parsedUrl: URL;

  try {
    parsedUrl = new URL(databaseUrl);
  } catch {
    throw new Error("DATABASE_URL is not a valid MongoDB connection string.");
  }

  let databaseName = parsedUrl.pathname.replace(/\//g, "");

  if (!databaseName) {
    console.warn("No database name found in DATABASE_URL. Auto-adding '/finops_suite' (update your .env for production).");
    parsedUrl.pathname = '/finops_suite';
    process.env.DATABASE_URL = parsedUrl.toString();
    databaseName = 'finops_suite';
  }
};

validateDatabaseUrl();

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const connectToDatabase = async (): Promise<void> => {
  await prisma.$connect();
  await prisma.$runCommandRaw({ ping: 1 });
  console.log("MongoDB connected through Prisma");
};

export const pingDatabase = async (): Promise<void> => {
  await prisma.$runCommandRaw({ ping: 1 });
};

export const disconnectFromDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export default prisma;
