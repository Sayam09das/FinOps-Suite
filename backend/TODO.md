# Fix 403 Forbidden on /api/auth/register (Port 5000 Conflict)

## Steps:
- [ ] 1. Kill AirTunes process on port 5000
- [ ] 2. Read and update server.ts to use port 3000
- [ ] 3. Restart backend server: cd backend && npm run dev
- [ ] 4. Run Prisma migrate: cd backend && npx prisma migrate dev
- [ ] 5. Test endpoints with curl/Postman on port 3000
- [ ] 6. Verify registration works

Progress: Starting step 1.

