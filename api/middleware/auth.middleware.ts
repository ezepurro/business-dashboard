import { NextFunction, Request, Response } from 'express';
import ApiError from '../utils/ApiError';
import { verifyAccessToken } from '../utils/jwt';
import { UserRole } from '../types/enums';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new ApiError(401, 'Token requerido.'));
  }

  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(new ApiError(401, 'Token inválido.'));
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    next(new ApiError(401, 'Token inválido o expirado.'));
  }
}

export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'No autenticado.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'No autorizado.'));
    }

    next();
  };
}
