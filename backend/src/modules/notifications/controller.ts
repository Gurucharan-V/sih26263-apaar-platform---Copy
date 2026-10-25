import { Request, Response, NextFunction } from 'express';
import { NotificationService } from './service';

export class NotificationController {
  static async sendNotice(req: Request, res: Response, next: NextFunction) {
    try {
      const { institutionId, message, type } = req.body;
      const result = await NotificationService.dispatchAlert(institutionId, message, type);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
