import { Request, Response, NextFunction } from 'express';
import { AuditService } from './service';

export class AuditController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await AuditService.list(req.query);
      res.json(logs);
    } catch (err) {
      next(err);
    }
  }
}
