import { z } from 'zod';

export const PaymentValidation = {
  initiatePaymentSchema: z.object({
    body: z.object({
      amount: z.number().positive(),
      paymentType: z.enum(['RENT', 'UTILITY', 'TRANSPORT_BOOKING']),
      referenceId: z.string().min(1, 'Reference ID is required'),
      gateway: z.enum(['BKASH', 'STRIPE', 'SSLCOMMERZ']).default('BKASH'),
    }),
  }),
  verifyWebhookSchema: z.object({
    body: z.object({
      transactionId: z.string().min(1, 'Transaction ID is required'),
      status: z.enum(['SUCCESS', 'FAILED', 'CANCELLED']),
    }),
  }),
};
