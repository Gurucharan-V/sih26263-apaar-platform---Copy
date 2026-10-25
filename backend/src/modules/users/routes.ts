import { Router } from 'express';
import { UserController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/me', authenticateJwt, UserController.getProfile);

export default router;
