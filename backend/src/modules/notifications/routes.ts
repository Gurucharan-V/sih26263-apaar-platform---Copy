import { Router } from 'express';
import { NotificationController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.post('/send', authenticateJwt, NotificationController.sendNotice);

export default router;
