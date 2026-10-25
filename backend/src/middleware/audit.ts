import { Request, Response, NextFunction } from 'express';
import prisma from '../config/db';
import { logger } from '../utils/logger';

export const logAuditEvent = (action: string, entity: string) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (req.user) {
        await prisma.auditLog.create({
          data: {
            userId: req.user.id,
            action,
            entity,
            entityId: (req.params.id || req.body?.id || null) as string | null,
            ipAddress: req.ip,
            details: req.body ? { bodyKeys: Object.keys(req.body) } : {},
          },
        });
      }
    } catch (err) {
      logger.error('Failed to write audit log:', err);
    }
    next();
  };
};
