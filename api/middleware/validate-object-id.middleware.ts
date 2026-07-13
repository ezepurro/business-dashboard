import { Types } from 'mongoose';

export function validateObjectId(param: string) {
  return (req:, res, next) => {
    if (!Types.ObjectId.isValid(req.params[param])) {
      return res.status(400).json({
        success: false,
        message: 'ID inválido.',
      });
    }

    next();
  };
}
