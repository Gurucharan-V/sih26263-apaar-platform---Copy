import { Request, Response, NextFunction } from 'express';

export const requireRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Forbidden: requires one of [${roles.join(', ')}]` });
    }
    next();
  };
};
