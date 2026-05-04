import { Router } from 'express';
import { protect, requireRole } from '../../common/middleware/auth.middleware';
import { validateRequest } from '../../common/middleware/validation.middleware';
import { getAdminAccess, getProfile, updateProfile } from './user.controller';
import { updateUserSchema } from './user.validation';

const router = Router({ mergeParams: true });

router.get('/', protect, getProfile);
router.get('/me', protect, getProfile);
router.patch('/me', protect, validateRequest(updateUserSchema), updateProfile);
router.get('/admin', protect, requireRole('ADMIN'), getAdminAccess);

export default router;
