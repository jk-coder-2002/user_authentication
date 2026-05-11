import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/async-handler';
import { authService } from '../services/auth.service';
import { successResponse } from '../utils/response';

const signup = asyncHandler(async (req: Request, res: Response) => {
    console.log('Signup request body:', req.body);
    const result = await authService.signup(req.body);
    return successResponse(res, 'User signup successful', result);
});

const login = asyncHandler(async (req: Request, res: Response) => {
    console.log('Login request body:', req.body);
    const result = await authService.login(req.body);
    return successResponse(res, 'User login successful', result);
});

export const authController = {
    signup,
    login
};
