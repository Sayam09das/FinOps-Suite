# FinOps Suite Backend

Express + TypeScript API for the FinOps Suite authentication and finance workflow.

## Stack

- Express 5
- TypeScript
- Prisma ORM
- MongoDB
- Clerk Express SDK

## Auth Architecture

- `@clerk/express` middleware is mounted globally in `src/app/app.ts`
- Protected routes use `protect` from `src/common/middleware/auth.middleware.ts`
- Clerk `userId` values are synced to the local MongoDB `User` model through `clerkId`
- Role assignment supports `USER` and `ADMIN`
- Protected API routes return `401` when the request is not authenticated

## Key Routes

- `GET /api/auth/me`
- `GET /api/user`
- `GET /api/user/admin`
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/dashboard`

## Prisma Models

### `User`

- `id`
- `clerkId`
- `email`
- `role`
- `createdAt`

### `Transaction`

- `id`
- `userId`
- `amount`
- `type`
- `category`
- `note`
- `date`
- `createdAt`

## Environment Variables

Copy the example file first:

```bash
cp .env.example .env
```

Required variables:

```env
NODE_ENV=development
PORT=5001
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/finops_suite?retryWrites=true&w=majority
CLERK_SECRET_KEY=sk_test_...
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000
CLERK_ADMIN_IDS=
CLERK_ADMIN_EMAILS=
```

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The API runs on `http://localhost:5001`.
