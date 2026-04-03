import { Router } from 'express';
import { protect, requireRole } from '../../common/middleware/auth.middleware';
import { getAdminAccess, getProfile } from './user.controller';

const router = Router({ mergeParams: true });

router.get('/', protect, getProfile);
router.get('/me', protect, getProfile);
router.get('/admin', protect, requireRole('ADMIN'), getAdminAccess);

export default router;
