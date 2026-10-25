import { Router } from 'express';
import { ProgrammeController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/', authenticateJwt, ProgrammeController.list);

export default router;
