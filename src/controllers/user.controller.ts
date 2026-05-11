import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { userService } from '../services/user.service';
import { successResponse } from '../utils/response';

const listUsers = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    q: req.query.q as string,
    status: req.query.status as string,
    gender: req.query.gender as string,
    sortBy: req.query.sortBy as string,
    sortOrder: (req.query.sortOrder as 'asc' | 'desc') || 'asc',
    page: parseInt(req.query.page as string) || 1,
    limit: parseInt(req.query.limit as string) || 10
  };

  const result = await userService.getAllUsers(query);
  return successResponse(res, 'Users fetched successfully', result);
});

export const userController = {
  listUsers
};
