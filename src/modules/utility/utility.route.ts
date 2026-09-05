import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { UtilityController } from './utility.controller.js';
import { UtilityValidation } from './utility.validation.js';

const router = Router();

router.post(
  '/',
  auth('PROVIDER', 'ADMIN'),
  validateRequest(UtilityValidation.createUtilityBillSchema),
  UtilityController.createUtilityBill
);

router.get('/my-bills', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UtilityController.getMyUtilityBills);
router.get('/:id', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), UtilityController.getUtilityBillById);

export default router;
