# FinOps Suite Client

Next.js App Router frontend for the FinOps Suite authentication flow.

## Stack

- Next.js 16
- TypeScript
- Tailwind CSS 4
- Clerk
- Framer Motion

## Auth Features

- `ClerkProvider` configured in `app/layout.tsx`
- Clerk route protection through `proxy.ts`
- Prebuilt Clerk sign-in and sign-up pages
- Protected dashboard at `/dashboard`
- Authenticated API service layer under `lib/api`
- Bearer-token requests using `useAuth().getToken()`

## Environment Variables

Copy the example file and add your Clerk values:

```bash
cp .env.example .env.local
```

Required variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard
```

## Run Locally

```bash
npm install
npm run dev
```

The app runs on `http://localhost:3000`.
