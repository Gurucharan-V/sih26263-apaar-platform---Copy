import { Request, Response, NextFunction } from 'express';
import { VerificationService } from './service';

export class VerificationController {
  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const { apaarId } = req.body;
      const record = await VerificationService.verifyApaar(apaarId);
      res.json(record);
    } catch (err) {
      next(err);
    }
  }
}
