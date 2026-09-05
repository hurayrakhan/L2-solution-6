import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { AdminController } from './admin.controller.js';

const router = Router();

router.get('/dashboard-stats', auth('ADMIN'), AdminController.getDashboardStats);
router.get('/users', auth('ADMIN'), AdminController.getAllUsers);
router.patch('/providers/:id/verify', auth('ADMIN'), AdminController.verifyProvider);
router.get('/audit-logs', auth('ADMIN'), AdminController.getAuditLogs);

export default router;
