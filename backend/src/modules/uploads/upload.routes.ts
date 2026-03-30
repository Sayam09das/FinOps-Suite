import { Router } from 'express';
import { protect } from '../../common/middleware/auth.middleware';
import { singleUpload, multipleUpload } from './upload.controller';

const router = Router();

router.post('/single', protect, singleUpload as any);
router.post('/multiple', protect, multipleUpload as any);

export default router;

