# Backend Setup

## Prerequisites
- Node.js 20+
- MongoDB (Atlas recommended)
- Prisma CLI: `npm i prisma -g` (optional)

## Quick Start
1. Copy env:
   ```
   cp .env.example .env
   ```
   Edit `.env`:
   - Set `DATABASE_URL` with your MongoDB connection string **including /finops_suite** database name.
   - Generate strong `JWT_SECRET`.

2. Install deps:
   ```
   npm install
   ```

3. Dev server:
   ```
   npm run dev
   ```

4. Init DB (first time):
   ```
   npx prisma db push
   ```
   Or for migrations:
   ```
   npx prisma migrate dev --name init
   ```

## Scripts
- `npm run dev`: ts-node-dev (nodemon)
- `npm run build`: tsc compile
- `npm run start`: production

## Structure
- `src/config/db.ts`: Prisma + MongoDB validation
- `prisma/schema.prisma`: Models (User, Transaction, Budget)

Hit localhost:5001/health for status.
