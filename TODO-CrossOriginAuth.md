# Cross-Origin Cookie Authentication Fix
Status: 🔄 Planning

**Root Cause:** Backend login returns JWT tokens in JSON only - NO `res.cookie()`. Frontend gets JSON but no httpOnly cookies set. `protect` middleware expects `cookies.accessToken` → 401 on /api/auth/me.

## Plan Steps:

- [✅] 1. **backend/src/modules/auth/auth.controller.ts** - Add `res.cookie()` in `sendAuthResponse()` ✓
  `httpOnly: true, secure: true, sameSite: 'none'`
- [✅] 2. **backend/src/modules/auth/logout.controller.ts** - Update `clearCookie()` options ✓
- [✅] 3. **Verify** `backend/src/config/env.ts` FRONTEND_URLS includes production domains ✓
- [✅] 4. **Test local**: Backend cookies now set correctly, /api/auth/me succeeds ✓
- [ ] 5. **Deploy** backend Render, frontend Vercel
- [ ] 6. **Prod test**: login → redirects /dashboard, cookies sent cross-origin

**Expected Result:** Login sets cookies → middleware/protect reads them → /dashboard accessible.
