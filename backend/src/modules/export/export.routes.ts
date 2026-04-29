import { Router } from 'express';
import { exportCSV } from './export.controller';

const router = Router();

router.get('/export/csv', exportCSV);

export default router;

