import { Router } from 'express';
import multer from 'multer';
import { UploadController } from './controller';
import { authenticateJwt } from '../../middleware/auth';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
const router = Router();

router.post('/', authenticateJwt, upload.single('file'), UploadController.create);
router.get('/', authenticateJwt, UploadController.list);
router.get('/:id', authenticateJwt, UploadController.getStatus);

export default router;
