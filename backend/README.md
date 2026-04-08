# FinOps Suite Backend

Express + TypeScript API for the FinOps Suite authentication and finance workflow.

## Stack

- Express 5
- TypeScript
- Prisma ORM
- MongoDB
- JWT auth
- bcrypt

## Auth Architecture

- `POST /api/auth/register` creates a local account with a hashed password
- `POST /api/auth/login` returns access and refresh tokens
- `POST /api/auth/refresh` refreshes an expired access token
- Protected routes use `protect` from `src/common/middleware/auth.middleware.ts`
- Role assignment supports `USER` and `ADMIN`
- Protected API routes return `401` when the request is not authenticated

## Key Routes

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `GET /api/auth/me`
- `GET /api/user`
- `GET /api/user/admin`
- `POST /api/transactions`
- `GET /api/transactions`
- `GET /api/dashboard`

## Prisma Models

### `User`

- `id`
- `email`
- `password`
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
JWT_ACCESS_SECRET=replace-me
JWT_REFRESH_SECRET=replace-me
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000
ADMIN_EMAILS=
```

## Setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

The API runs on `http://localhost:5001`.
