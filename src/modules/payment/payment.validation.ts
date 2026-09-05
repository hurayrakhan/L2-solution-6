import { z } from 'zod';

export const PaymentValidation = {
  initiatePaymentSchema: z.object({
    body: z.object({
      amount: z.number().positive(),
      paymentType: z.enum(['RENT', 'UTILITY', 'TRANSPORT_BOOKING']),
      referenceId: z.string().min(1, 'Reference ID is required'),
      gateway: z.enum(['STRIPE', 'SSLCOMMERZ' /* 'BKASH' commented out for now */]).default('STRIPE'),
    }),
  }),
  createStripeCheckoutSessionSchema: z.object({
    body: z.object({
      amount: z.number().positive(),
      paymentType: z.enum(['RENT', 'UTILITY', 'TRANSPORT_BOOKING']),
      referenceId: z.string().min(1, 'Reference ID is required'),
      successUrl: z.string().url().optional(),
      cancelUrl: z.string().url().optional(),
    }),
  }),
  verifyWebhookSchema: z.object({
    body: z.object({
      transactionId: z.string().min(1, 'Transaction ID is required'),
      status: z.enum(['SUCCESS', 'FAILED', 'CANCELLED']),
    }),
  }),
};

