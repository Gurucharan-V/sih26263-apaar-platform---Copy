import { Request, Response, NextFunction } from 'express';
import { InstitutionService } from './service';

export class InstitutionController {
  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await InstitutionService.listAll();
      res.json(list);
    } catch (err) {
      next(err);
    }
  }

  static async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await InstitutionService.getById(req.params.id);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
}
