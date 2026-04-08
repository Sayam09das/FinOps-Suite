# FinOps Suite Client

Next.js App Router frontend for the FinOps Suite authentication flow.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Zustand
- Framer Motion

## Auth Features

- Custom sign-in and sign-up pages at `/sign-in` and `/sign-up`
- Persisted client auth store backed by JWT access + refresh tokens
- Protected dashboard at `/dashboard`
- Authenticated API service layer under `lib/api`
- Bearer-token requests using the stored access token

## Environment Variables

Copy the example file and add your API URL:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

## Run Locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.
