import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { userService } from '../services/user.service';
import { successResponse } from '../utils/response';

const listUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  return successResponse(res, 'Users fetched successfully', users);
});

export const userController = {
  listUsers
};
