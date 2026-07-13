import authController from '../controllers/auth.controller';
import validateRequest from '../middleware/validation.middleware';
import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { loginValidator, registerValidator } from '../validators/auth.validator';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

router.post('/register', authLimiter, registerValidator, validateRequest, authController.register);

router.post('/login', authLimiter, loginValidator, validateRequest, authController.login);

router.post('/refresh', authController.refresh);

router.post('/logout', authenticate, authController.logout);

router.get('/me', authenticate, authController.me);

export default router;
