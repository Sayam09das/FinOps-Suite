# Uploads Module w/ Cloudinary - Setup Complete

**Files:**
- ✅ config/cloudinary.ts
- ✅ config/env.ts (add keys to .env)
- ✅ modules/uploads/* (service, controller, routes, index, types)

**Endpoints (protected):**
- POST /api/uploads/single – single image/PDF → URL
- POST /api/uploads/multiple – up to 5 files → array URLs

**Next:**
1. Add to backend/.env:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```
2. `npm run dev` – test with Postman (form-data 'files')
3. Mount `app.use('/api/uploads', uploadsIndex);` in app.ts if needed

Ready – add your Cloudinary keys! ☁️
