import { Router } from 'express';
import { IntakeController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/discrepancies', authenticateJwt, IntakeController.getDiscrepancies);

export default router;
