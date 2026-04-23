# Fix Login → Dashboard Auth Issue
Status: ✅ Planned | ⏳ In Progress | ✅ Completed

## Problem
- Login succeeds → brief dashboard → back to login (401 on /api/auth/me)
- Cross-origin cookies fail (vercel→render) + empty localStorage token

## Steps (Approved Plan)

### ✅ 1. Backend: Return accessToken in /login response
**File**: `backend/src/modules/auth/auth.controller.ts`
- Add `accessToken` to `ApiResponse.success(session.user, ...)` → `{user, accessToken}`
- Ensure cookie `sameSite: 'none'` in prod
**Status**: Complete

### ✅ 2. Frontend: Store real accessToken post-login  
**File**: `client/app/features/auth/hooks/use-auth.tsx`
```
setAuthData(accessToken || '', userData)
```
- Grace extended: 30s
**Status**: Complete

### ✅ 3. Enhance useAuthMeQuery retry
**File**: `client/app/lib/api/queries.ts`
```
retry: 3,
retryDelay: exponential backoff (1s→5s)
```
**Status**: Complete

### ✅ 4. CORS origins (already dynamic ✅)
**File**: `backend/src/config/cors.ts`
```
already handles vercel/render via ENV
```

### ✅ 5. Dashboard grace-aware
**File**: `client/app/features/dashboard/hooks/use-dashboard.ts`
```
enabled: isAuthenticated || !!graceUser
```
**Status**: Complete

### ☐ 6. Test & Deploy
```
backend: npm run build && npm start
frontend: npm run build && npm start
Test: login → dashboard → persist >30s
Deploy: Render/Vercel → prod test
```

## Progress Tracking
- [] Step 1 Complete
- [] Step 2 Complete
...

**Next**: Update this file after each step ✅

