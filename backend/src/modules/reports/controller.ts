import { Request, Response, NextFunction } from 'express';
import { ReportService } from './service';

export class ReportController {
  static async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await ReportService.getSystemSummary();
      res.json(summary);
    } catch (err) {
      next(err);
    }
  }
}
