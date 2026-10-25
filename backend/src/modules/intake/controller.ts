import { Request, Response, NextFunction } from 'express';
import { IntakeService } from './service';

export class IntakeController {
  static async getDiscrepancies(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await IntakeService.checkDiscrepancies();
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
