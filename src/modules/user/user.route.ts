import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { UserController } from './user.controller.js';

const router = Router();

router.get('/me', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UserController.getMyProfile);
router.patch('/me', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UserController.updateMyProfile);

export default router;
