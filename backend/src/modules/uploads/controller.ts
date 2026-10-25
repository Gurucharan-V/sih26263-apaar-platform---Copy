import { Request, Response, NextFunction } from 'express';
import { UploadService } from './service';

export class UploadController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const institutionId = req.user?.institutionId || req.body.institutionId;
      const result = await UploadService.processUpload(req.file, institutionId, req.body.programmeId);
      res.status(202).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async getStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const details = await UploadService.getById(req.params.id);
      res.json(details);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const history = await UploadService.list(req.user?.institutionId);
      res.json(history);
    } catch (err) {
      next(err);
    }
  }
}
