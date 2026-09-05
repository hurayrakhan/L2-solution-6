import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { UserController } from './user.controller.js';

const router = Router();

router.get('/me', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UserController.getMyProfile);
router.patch('/me', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UserController.updateMyProfile);
router.get('/:id', auth('ADMIN'), UserController.getUserById);
router.patch('/:id/role', auth('ADMIN'), UserController.updateUserRole);
router.delete('/:id', auth('ADMIN'), UserController.deleteUser);

export default router;

