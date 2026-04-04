import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';

export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ 
        message: `Access denied. This action requires one of these roles: ${roles.join(', ')}` 
      });
      return;
    }

    next();
  };
};