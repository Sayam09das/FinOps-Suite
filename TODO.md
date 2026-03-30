# Queue Implementation TODO - FinOps Suite

## Completed
- [x] 1. Install dependencies: `cd backend && npm install bullmq`
- [x] 2. Implement `backend/src/infrastructure/queue/index.ts` (Queue registration)
- [x] 3. Implement `backend/src/infrastructure/queue/notification.queue.ts` (Jobs + Worker)
- [x] 4. Update `backend/src/app/app.ts` (Start queue worker)

## Pending (Bonus integrations)
- [ ] 5. Update notifications service to use queue.add()
- [ ] 6. Remove old notification.worker.ts
- [ ] 7. Test queue

**Queue files complete! Run `cd backend && npm run dev` (Redis required).**

Test endpoint example: Add POST /api/queue/test-job {userId, title, etc} using addNotificationJob
