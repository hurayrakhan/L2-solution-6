import { z } from 'zod';

export const PaymentValidation = {
  initiatePaymentSchema: z.object({
    body: z.object({
      amount: z.number({ required_error: 'Amount is required' }).positive(),
      paymentType: z.enum(['RENT', 'UTILITY', 'TRANSPORT_BOOKING']),
      referenceId: z.string({ required_error: 'Reference ID is required' }),
      gateway: z.enum(['BKASH', 'STRIPE', 'SSLCOMMERZ']).default('BKASH'),
    }),
  }),
  verifyWebhookSchema: z.object({
    body: z.object({
      transactionId: z.string({ required_error: 'Transaction ID is required' }),
      status: z.enum(['SUCCESS', 'FAILED', 'CANCELLED']),
    }),
  }),
};
