# Cross-Origin Auth Fix TODO

## Plan Status: ✅ Approved

**Step 1: ✅ Fixed backend cookie settings**
- File: `backend/src/modules/auth/auth.controller.ts`
- Force `secure: true`, `sameSite: 'none'` for cross-origin cookies

**Step 2: ✅ Fixed frontend middleware**
- File: `client/app/middleware.ts`
- Removed unnecessary clearing of `finops.*` cookies on auth failure

**Step 3: [PENDING] Test local login flow**
- Backend: `cd backend && npm run dev`
- Frontend: `cd client && npm run dev`
- Login → verify `finops.access-token`, `finops.refresh-token` appear in DevTools (localhost:5000 domain)

**Step 4: [PENDING] Deploy & production test**
- Backend: Render deploy  
- Frontend: Vercel deploy
- Test login → verify cookies stored under `finops-suite.onrender.com` domain
- Verify /dashboard doesn't redirect & /api/auth/me returns 200
