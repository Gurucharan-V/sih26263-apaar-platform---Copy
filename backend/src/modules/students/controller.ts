import { Request, Response, NextFunction } from 'express';
import { StudentService } from './service';

export class StudentController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const student = await StudentService.createSingle(req.body, req.user?.institutionId || req.body.institutionId);
      res.status(201).json(student);
    } catch (err) {
      next(err);
    }
  }

  static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await StudentService.list(req.query);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }
}
