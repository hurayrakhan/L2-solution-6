import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { PaymentController } from './payment.controller.js';
import { PaymentValidation } from './payment.validation.js';

const router = Router();

router.post(
  '/initiate',
  auth('TENANT_USER', 'PROVIDER', 'ADMIN'),
  validateRequest(PaymentValidation.initiatePaymentSchema),
  PaymentController.initiatePayment
);

router.post('/webhook', validateRequest(PaymentValidation.verifyWebhookSchema), PaymentController.verifyPaymentWebhook);

router.get('/:id', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), PaymentController.getPaymentById);

export default router;
