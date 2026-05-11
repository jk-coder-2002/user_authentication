import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/app-error';
import { errorResponse } from '../utils/response';

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): Response => {
  if (err instanceof AppError) {
    return errorResponse(res, err.statusCode, err.message, err.errors);
  }

  return errorResponse(res, 500, 'Internal server error', []);
};
