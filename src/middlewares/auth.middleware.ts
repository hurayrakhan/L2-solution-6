import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config/index.js';
import { AppError } from '../utils/app-error.js';
import { catchAsync } from '../utils/catchAsync.js';
import { prisma } from '../utils/prisma.js';

export interface CustomRequest extends Request {
  user?: JwtPayload & { id: string; email: string; role: string };
}

export const auth = (...requiredRoles: string[]) => {
  return catchAsync(async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new AppError('You are not authorized to access this route', 401);
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    } catch (err) {
      throw new AppError('Invalid or expired token', 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user || user.deletedAt) {
      throw new AppError('User belonging to this token no longer exists', 401);
    }

    if (requiredRoles.length && !requiredRoles.includes(user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    next();
  });
};
