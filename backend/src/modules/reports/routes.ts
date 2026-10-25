import { Router } from 'express';
import { ReportController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/summary', authenticateJwt, ReportController.getSummary);

export default router;
