import { Router } from 'express';
import { CaseController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/', authenticateJwt, CaseController.list);
router.patch('/:caseId/resolve', authenticateJwt, CaseController.resolve);

export default router;
