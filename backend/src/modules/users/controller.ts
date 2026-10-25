import { Request, Response, NextFunction } from 'express';
import { UserService } from './service';

export class UserController {
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserService.getById(req.user!.id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }
}
