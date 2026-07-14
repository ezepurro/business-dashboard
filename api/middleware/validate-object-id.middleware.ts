import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

export function validateObjectId(param: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.params[param];

    if (typeof value !== 'string' || !Types.ObjectId.isValid(value)) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido.',
      });
    }

    next();
  };
}
