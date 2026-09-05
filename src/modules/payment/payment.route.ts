import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { PaymentController } from './payment.controller.js';
import { PaymentValidation } from './payment.validation.js';

const router = Router();

router.post(
  '/stripe/create-checkout-session',
  auth('TENANT_USER', 'PROVIDER', 'ADMIN'),
  validateRequest(PaymentValidation.createStripeCheckoutSessionSchema),
  PaymentController.createStripeCheckoutSession
);

router.post('/stripe/webhook', PaymentController.handleStripeWebhook);

router.post(
  '/initiate',
  auth('TENANT_USER', 'PROVIDER', 'ADMIN'),
  validateRequest(PaymentValidation.initiatePaymentSchema),
  PaymentController.initiatePayment
);

router.post('/webhook', validateRequest(PaymentValidation.verifyWebhookSchema), PaymentController.verifyPaymentWebhook);

router.get('/', auth('ADMIN'), PaymentController.getAllPayments);
router.get('/:id', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), PaymentController.getPaymentById);
router.patch('/:id/refund', auth('ADMIN'), PaymentController.refundPayment);

export default router;


