import { Request, Response, NextFunction } from 'express';
import { ProgrammeService } from './service';

export class ProgrammeController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const institutionId = req.query.institutionId as string | undefined;
      const list = await ProgrammeService.list(institutionId);
      res.json(list);
    } catch (err) {
      next(err);
    }
  }
}
