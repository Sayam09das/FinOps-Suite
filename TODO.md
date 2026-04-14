# Fix Auth/Backend Connection
Status: In Progress

## Steps:

### 1. Verify/Start Backend [x] - Running :5000 (Redis optional)
- cd backend
- npm install (if needed)
- Check .env: DATABASE_URL, JWT secrets
- npx prisma generate && npx prisma db push
- npm run dev (http://localhost:5001)
- Verify: curl http://localhost:5001/api/health

### 2. Configure Client API Base URL [ ]
- Add to client/.env.local: NEXT_PUBLIC_API_URL=http://localhost:5001/api

### 3. Update apiClient to use base URL [x]
### 3.5. Fix endpoints.session → /me [x]
- Edit client/lib/api/client.ts: Prefix input with baseURL in apiRequest

### 4. Ensure Auth Hydration [ ]
- Check client/app/providers.tsx: Call useAuthStore.getState().hydrateSession()

### 5. Fix Dashboard Navbar Handler [ ]
- Edit client/app/dashboard/page.tsx: Add onProfileAction with store.logout() for 'logout'

### 6. Test End-to-End [ ]
- Client: npm run dev (:3000)
- Register/Login → Dashboard → Logout
- Check Network tab for successful /api/auth/* calls

### 7. Update TODOs [ ]
- Mark complete
- Remove Todo/TODO-FixBackendConnection.md

**Current: Starting step 1**
