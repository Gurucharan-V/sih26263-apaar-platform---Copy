import { Router } from 'express';
import { StudentController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.post('/', authenticateJwt, StudentController.create);
router.get('/', authenticateJwt, StudentController.list);

export default router;
