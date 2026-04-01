# FinOps Suite Backend

Production-oriented backend for the FinOps Suite application. This service provides authentication, user management, transactions, budgets, analytics, notifications, uploads, health checks, and background job support.

## Tech Stack

- Node.js
- TypeScript
- Express
- Prisma
- MongoDB
- BullMQ
- Redis
- Cloudinary
- Resend
- Socket.IO
- Vitest

## Core Features

- JWT-based authentication
- User profile APIs
- Transaction management
- Budget management
- Dashboard and analytics endpoints
- Notification APIs and worker integration
- File upload support
- Health and database status endpoints
- Background cleanup and scheduled job support

## Project Structure

```text
backend/
├── prisma/                     # Prisma schema and database configuration
├── src/
│   ├── app/                    # Express app, server bootstrap, shutdown
│   ├── common/                 # Shared errors, middleware, validators, utils
│   ├── config/                 # Env loading, DB, logger, CORS, constants
│   ├── infrastructure/         # Redis, queue, mail, storage integrations
│   ├── jobs/                   # Background and scheduled jobs
│   ├── modules/                # Feature modules
│   │   ├── analytics/
│   │   ├── auth/
│   │   ├── budgets/
│   │   ├── dashboard/
│   │   ├── health/
│   │   ├── notifications/
│   │   ├── transactions/
│   │   ├── uploads/
│   │   └── user/
│   └── types/                  # Shared type declarations
├── tests/                      # Test setup and integration tests
├── .env.example                # Environment variable template
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

## Requirements

- Node.js 20+
- npm 10+
- MongoDB Atlas or local MongoDB instance
- Redis for queue and cache features

Optional:

- Cloudinary for uploads
- Resend for email delivery

## Environment Variables

Copy the example file first:

```bash
cp .env.example .env
```

### Required

| Variable | Description |
|---|---|
| `NODE_ENV` | App environment, usually `development` or `production` |
| `PORT` | Port used by the API server |
| `DATABASE_URL` | MongoDB connection string including the database name |
| `JWT_SECRET` | Secret used to sign access tokens |
| `JWT_REFRESH_SECRET` | Secret used to sign refresh tokens |

### Frontend and CORS

| Variable | Description |
|---|---|
| `FRONTEND_URL` | Primary frontend origin |
| `FRONTEND_URLS` | Comma-separated allowed origins for CORS |

Example:

```env
FRONTEND_URL=https://fin-ops-suite.vercel.app
FRONTEND_URLS=http://localhost:3000,https://fin-ops-suite.vercel.app
```

### Redis

| Variable | Description |
|---|---|
| `REDIS_HOST` | Redis host |
| `REDIS_PORT` | Redis port |
| `REDIS_CONNECT_TIMEOUT_MS` | Redis connection timeout |
| `REDIS_RETRY_COOLDOWN_MS` | Cooldown before reconnect attempts |

### Optional Integrations

| Variable | Description |
|---|---|
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `OWNER_EMAIL` | Default sender email address |

## Local Development

Install dependencies:

```bash
npm install
```

Generate Prisma client and sync schema:

```bash
npx prisma generate
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

The API runs on:

```text
http://localhost:5001
```

## Available Scripts

- `npm run dev` starts the backend in development mode with `ts-node-dev`
- `npm run build` compiles TypeScript using `tsconfig.build.json`
- `npm start` runs the compiled production build from `dist/index.js`
- `npm test` runs Vitest
- `npm run test:watch` runs tests in watch mode
- `npm run test:ui` opens the Vitest UI
- `npm run test:coverage` runs coverage

## API Entry Points

Main route groups mounted in the app:

- `/api/auth`
- `/api/user`
- `/api/transactions`
- `/api/dashboard`
- `/api`
- `/api/analytics`
- `/api/notifications`
- `/api/uploads`
- `/api/health`

Utility endpoints:

- `/` returns basic API metadata
- `/test-db` checks database connectivity and user count

Health endpoint:

```text
GET /api/health
```

## Architecture Notes

- `src/index.ts` loads environment variables and starts the server
- `src/app/server.ts` creates the HTTP server and Socket.IO instance
- `src/app/app.ts` wires middleware, route modules, workers, and error handling
- `src/config/db.ts` validates `DATABASE_URL` and initializes Prisma
- `src/config/cors.ts` supports multiple frontend origins through `FRONTEND_URLS`
- `src/infrastructure/cache/redis.ts` keeps Redis optional and degrades safely if unavailable
- `src/jobs/cleanup.job.ts` handles cleanup tasks such as deleting old notifications and temp files

## Build and Production Run

Build:

```bash
npm run build
```

Start:

```bash
npm start
```

## Render Deployment

If this repository is deployed as a monorepo on Render, use:

- Root Directory: `backend`
- Build Command: `npm ci && npm run build`
- Start Command: `npm start`

Recommended production environment variables on Render:

- `NODE_ENV=production`
- `PORT=10000` or Render-provided port behavior
- `DATABASE_URL=...`
- `JWT_SECRET=...`
- `JWT_REFRESH_SECRET=...`
- `FRONTEND_URL=https://fin-ops-suite.vercel.app`
- `FRONTEND_URLS=http://localhost:3000,https://fin-ops-suite.vercel.app`

Add Redis, Cloudinary, and Resend variables only if those integrations are enabled in production.

## Testing

Run the test suite:

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

## Production Notes

- Keep secrets only in environment variables
- Use strong JWT secrets in production
- Keep `DATABASE_URL` pointed at a production database with an explicit database name
- Restrict `FRONTEND_URLS` to trusted origins only
- Enable Redis in production if you rely on queue or cache features
- Use Cloudinary and Resend only when the corresponding features are live

## Backend Checklist

- Environment variables configured
- MongoDB reachable
- Prisma client generated
- Redis available if queues are required
- Build passes with `npm run build`
- Health check responds at `/api/health`
