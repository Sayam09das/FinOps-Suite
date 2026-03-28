// Updated for MongoDB - no migrations needed
// import { defineConfig } from 'prisma/config';

export default {
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
} as any;
