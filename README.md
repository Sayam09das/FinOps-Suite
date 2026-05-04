# FinOps Suite

FinOps Suite is a full-stack financial operations workspace for individuals, operators, and teams who need one place to manage transactions, budgets, accounts, goals, collaboration, security visibility, and operational finance insights.

The repository is organized as a production-oriented monorepo with a Next.js frontend and an Express + Prisma backend, designed to support authenticated dashboards, real-time notifications, live currency conversion, role-aware access patterns, and modular financial workflows.

## Highlights

- Real-time dashboard experiences powered by React Query polling and Socket.IO events
- Secure authentication with access and refresh tokens, cookie support, and protected routes
- Modular finance domains for transactions, budgets, transfers, accounts, goals, collaboration, and security
- Live notification pipeline with unread counts, mark-as-read actions, and in-app realtime delivery
- MongoDB + Prisma persistence layer for application data and user preferences
- Production-ready frontend architecture based on the Next.js App Router

## Architecture

```text
client/   Next.js 16 + React 19 + TypeScript
backend/  Express 5 + Prisma + MongoDB + Socket.IO + TypeScript
```

### Frontend

- Next.js App Router
- React Query for server-state synchronization
- Framer Motion for interaction and transitions
- Tailwind-based component styling
- Socket.IO client for realtime notifications

### Backend

- Express API with modular route organization
- Prisma ORM targeting MongoDB
- JWT-based authentication and refresh flow
- Socket.IO server for realtime delivery
- Notification worker hooks for asynchronous event processing

## Product Areas

- Authentication and session handling
- Dashboard overview and analytics
- Budgeting and spend tracking
- Bank accounts, wallets, cards, and transfers
- Savings, debt, and investment goals
- Collaboration: shared accounts, group expenses, user invites
- Security: login activity, audit logs, permissions
- Settings: profile, currency/locale, notifications, integration status

## Repository Structure

```text
.
├── client/         Frontend application
├── backend/        API, database access, and realtime backend
├── File-Readme/    Internal notes and implementation references
├── Source/         Supporting project notes
└── Todo/           Work-in-progress planning documents
```

## Getting Started

### Requirements

- Node.js 20+
- npm 10+
- MongoDB database
- Redis optional for queue-backed notification workloads

### 1. Install dependencies

```bash
cd client
npm install

cd ../backend
npm install
```

### 2. Configure environment variables

Frontend environment:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
NEXT_PUBLIC_GITHUB_CLIENT_ID=
```

Backend environment:

```env
NODE_ENV=development
PORT=5001
DATABASE_URL=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/finops_suite
JWT_ACCESS_SECRET=<strong-secret>
JWT_REFRESH_SECRET=<strong-secret>
FRONTEND_URL=http://localhost:3000
FRONTEND_URLS=http://localhost:3000,http://localhost:3001
ADMIN_EMAILS=
OWNER_EMAIL=
REDIS_HOST=
REDIS_PORT=
REDIS_CONNECT_TIMEOUT_MS=
REDIS_RETRY_COOLDOWN_MS=
RESEND_API_KEY=
```

### 3. Generate Prisma client and sync schema

```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Start the applications

Frontend:

```bash
cd client
npm run dev
```

Backend:

```bash
cd backend
npm run dev
```

Default local URLs:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5001`

## Core Scripts

### Client

```bash
npm run dev
npm run build
npm run start
npm run lint
```

### Backend

```bash
npm run dev
npm run build
npm run start
npm run test
npm run test:coverage
```

## Authentication Model

- Login and registration are handled by the backend API
- Access and refresh tokens are issued server-side
- Cookies are supported for production-safe session persistence
- Local token storage exists as a fallback for client continuity
- Protected routes redirect unauthenticated users away from dashboard pages

## Realtime Features

- Navbar notifications update from backend data and Socket.IO events
- Dashboard queries use periodic refresh for live operational state
- AI insight panel derives signals from current dashboard data
- Collaboration, goals, and security views are designed around live backend state rather than demo data

## Deployment Notes

FinOps Suite is intended to run with:

- Frontend deployed on Vercel
- Backend deployed on a Node-compatible host
- MongoDB Atlas or another managed MongoDB deployment

Recommended production checklist:

1. Set all frontend and backend environment variables explicitly
2. Run `npx prisma db push` against the target database
3. Deploy backend first so frontend API calls and socket connections resolve correctly
4. Deploy frontend after backend URLs and CORS origins are confirmed
5. Validate authenticated navigation, notifications, and dashboard routes in production

## Engineering Notes

- The codebase contains historical planning and migration notes under `Todo/` and `File-Readme/`
- Case-sensitive route naming matters for deployment targets, especially on Linux-based hosting
- Prisma schema changes should always be followed by `prisma generate` and `prisma db push`

## License

This repository currently does not declare a public open-source license. Add one before external distribution.
