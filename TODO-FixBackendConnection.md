# Fix Backend Connection for Login/Register

## Status: [ ] In Progress

## Steps:

### 1. Backend Setup & Run [x] Done

✅ npm install, prisma generate, db push complete. Backend running on http://localhost:5001 (terminal active).

- cd backend
- cp .env.example .env (if not done)
- Edit backend/.env: Set DATABASE_URL (MongoDB Atlas), JWT_ACCESS_SECRET, JWT_REFRESH_SECRET
- npm install
- npx prisma generate  
- npx prisma db push
- npm run dev  (runs on http://localhost:5001)

### 2. Client Environment Update [ ] Done
- In client/.env.local: Set `NEXT_PUBLIC_API_URL=http://localhost:5001`

### 3. Run Client [ ] Done
- cd client
- npm run dev  (runs on http://localhost:3000)

### 4. Test [ ] Done
- Visit http://localhost:3000/login or /register
- Try login/register - should connect to local backend
- Check browser Network tab for successful /api/auth/* calls

### 5. Render Fix (Optional) [ ] Done
- Check https://dashboard.render.com - ensure service healthy
- Verify env vars on Render (DATABASE_URL, etc.)
- Redeploy if needed

### 6. Verify Completion [ ] Done
- Mark all steps Done
- Test dashboard after login

**Next:** Update checkboxes as you complete. Ping me when step done or issues.
