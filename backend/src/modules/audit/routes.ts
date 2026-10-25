import { Router } from 'express';
import { AuditController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/', authenticateJwt, AuditController.list);

export default router;
