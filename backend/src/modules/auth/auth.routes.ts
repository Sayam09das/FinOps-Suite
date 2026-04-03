import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { getSession } from './auth.controller';

const router = Router();

router.get('/me', protect, getSession);

export default router;
