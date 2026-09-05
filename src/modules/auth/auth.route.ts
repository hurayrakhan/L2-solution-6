import { Router } from 'express';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { AuthController } from './auth.controller.js';
import { AuthValidation } from './auth.validation.js';

const router = Router();

router.post('/register', validateRequest(AuthValidation.registerSchema), AuthController.registerUser);
router.post('/login', validateRequest(AuthValidation.loginSchema), AuthController.loginUser);
router.post('/refresh-token', AuthController.refreshToken);

export default router;
