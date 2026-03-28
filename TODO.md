# Advanced Auth & User System + Common Configs

## TODO Steps (Breakdown of approved plan):

### 1. Auth Module (Advanced)
- [x] Populate `backend/src/modules/auth/auth.validation.ts` (Zod schemas)
- [x] Populate `backend/src/modules/auth/auth.types.ts` (interfaces)
- [x] Create `backend/src/modules/auth/auth.repository.ts` (Prisma layer)
- [x] Refactor `backend/src/modules/auth/auth.service.ts` to use repo + validation
- [x] Update `backend/src/modules/auth/auth.routes.ts` with validation middleware
- [x] Update `backend/src/modules/auth/index.ts` (export all)

### 2. User Module (Complete CRUD)
- [ ] Create `backend/src/modules/user/user.controller.ts`
- [ ] Create `backend/src/modules/user/user.service.ts`
- [ ] Create `backend/src/modules/user/user.repository.ts`
- [ ] Create `backend/src/modules/user/user.validation.ts`
- [ ] Create `backend/src/modules/user/user.types.ts`
- [ ] Create `backend/src/modules/user/index.ts`
- [ ] Update `backend/src/modules/user/user.routes.ts` with full CRUD

### 3. Common/Config Files
- [ ] Create `backend/src/config/env.ts` (Zod env validation)
- [ ] Create `backend/src/common/logger.ts` (Pino logger)
- [ ] Create `backend/src/common/cors.ts` (CORS config)
- [ ] Create `backend/src/common/rateLimit.ts` (express-rate-limit)
- [ ] Create `backend/src/common/constants.ts`

### 4. Integrate & Test
- [x] Install deps
- [ ] Update app.ts/server.ts to use new configs
- [ ] Test all endpoints
- [ ] ✅ Complete
