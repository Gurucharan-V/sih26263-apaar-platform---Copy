import { Request, Response, NextFunction } from 'express';
import { CaseService } from './service';

export class CaseController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const cases = await CaseService.list(req.query);
      res.json(cases);
    } catch (err) {
      next(err);
    }
  }

  static async resolve(req: Request, res: Response, next: NextFunction) {
    try {
      const { caseId } = req.params;
      const { resolution, notes } = req.body;
      const resolved = await CaseService.resolve(caseId, resolution, notes, req.user?.email || 'admin');
      res.json(resolved);
    } catch (err) {
      next(err);
    }
  }
}
