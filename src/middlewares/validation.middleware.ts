import type { RequestHandler } from 'express';
import { AppError } from '../utils/app-error';

export const validateRequest = (validator: (req: Parameters<RequestHandler>[0]) => string[]): RequestHandler => {
  return (req, _res, next) => {
    const errors = validator(req);
    if (errors.length > 0) {
      return next(new AppError('Validation failed', 400, errors));
    }
    next();
  };
};
