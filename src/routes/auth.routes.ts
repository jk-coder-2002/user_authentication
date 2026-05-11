import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validateLogin, validateSignup } from '../validations/auth.validation';
import { validateRequest } from '../middlewares/validation.middleware';

const router = Router();

router.post('/signup', validateRequest(validateSignup), authController.signup);
router.post('/login', validateRequest(validateLogin), authController.login);

export default router;
