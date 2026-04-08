# Production-Grade Auth System - Implementation Steps

## [ ] 1. Backend Updates
   - [ ] Implement OAuth repo methods (auth.repository.ts)
   - [ ] Add cookie setting to sendAuthResponse (auth.controller.ts)
   - [ ] Fix oauth.controller.ts imports

## [x] 2. Frontend NextAuth Setup
   - [x] Create NextAuth config (moved to app/api/auth/[[...nextauth]]/route.ts - delete old dir)
   - [x] Wrap app with NextAuthProvider (providers.tsx)

## [ ] 3. Frontend Auth Services & State
   - [ ] Implement auth-service.ts (API calls)
   - [ ] Setup auth.store.ts (Zustand)

## [ ] 4. Auth UI
   - [ ] Create responsive login/register page (client/app/auth/sign-in/page.tsx)

## [ ] 5. Middleware & API Client
   - [ ] Update client/app/middleware.ts for auth
   - [ ] Ensure API client credentials:'include'

## [ ] 6. Testing
   - [ ] Backend: npm run dev, test /auth routes
   - [ ] Frontend: npm run dev, test login/OAuth
   - [ ] Check cookies, /me, protected routes

## [ ] 7. Final
   - Update this TODO with completions
   - attempt_completion

