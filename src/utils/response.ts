import type { Response } from 'express';

export const successResponse = (res: Response, message: string, data: unknown = {}): Response => {
  return res.status(200).json({ success: true, message, data });
};

export const errorResponse = (res: Response, statusCode: number, message: string, errors: string[] = []): Response => {
  return res.status(statusCode).json({ success: false, message, errors });
};
