import { Router } from 'express';
import { VerificationController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.post('/', authenticateJwt, VerificationController.verify);

export default router;
