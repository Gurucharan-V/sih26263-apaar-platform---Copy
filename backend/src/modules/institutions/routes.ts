import { Router } from 'express';
import { InstitutionController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const router = Router();
router.get('/', authenticateJwt, InstitutionController.list);
router.get('/:id', authenticateJwt, InstitutionController.getOne);

export default router;
