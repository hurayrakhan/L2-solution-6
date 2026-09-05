import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const initiatePaymentInDB = async (userId: string, payload: any) => {
  const { amount, paymentType, referenceId, gateway = 'STRIPE' } = payload;

  const transactionId = `TXN_${gateway}_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

  const payment = await prisma.payment.create({
    data: {
      userId,
      amount,
      paymentType,
      referenceId,
      gateway,
      transactionId,
      status: 'INITIATED',
    },
  });

  let paymentUrl = '';

  /* bKash Payment Integration (Commented out for now - using Stripe & SSLCommerz)
  if (gateway === 'BKASH') {
    paymentUrl = `https://sandbox.bkash.com/checkout?trxID=${transactionId}&amount=${amount}`;
  } else
  */

  if (gateway === 'STRIPE') {
    paymentUrl = `https://checkout.stripe.com/pay/${transactionId}`;
  } else {
    paymentUrl = `https://sandbox.sslcommerz.com/gwprocess/v4/api.php?Q=${transactionId}`;
  }

  return {
    payment,
    paymentUrl,
  };
};

const verifyPaymentWebhookInDB = async (payload: { transactionId: string; status: 'SUCCESS' | 'FAILED' | 'CANCELLED' }) => {
  const { transactionId, status } = payload;

  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      throw new AppError('Transaction not found', 404);
    }

    const updatedPayment = await tx.payment.update({
      where: { transactionId },
      data: { status },
    });

    if (status === 'SUCCESS') {
      if (payment.paymentType === 'TRANSPORT_BOOKING') {
        await tx.transportBooking.update({
          where: { id: payment.referenceId },
          data: { escrowStatus: 'HELD', status: 'ACCEPTED' },
        });
      } else if (payment.paymentType === 'UTILITY') {
        await tx.utilityPayment.updateMany({
          where: { utilityBillId: payment.referenceId, tenantId: payment.userId },
          data: { paymentStatus: 'SUCCESS', transactionId, paidAt: new Date() },
        });
      }
    }

    await tx.auditLog.create({
      data: {
        userId: payment.userId,
        action: 'PAYMENT_WEBHOOK_VERIFICATION',
        entity: 'Payment',
        entityId: payment.id,
        details: `Payment transaction ${transactionId} via ${payment.gateway} updated status to ${status}`,
      },
    });

    return updatedPayment;
  });
};

const getPaymentByIdFromDB = async (id: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!payment) {
    throw new AppError('Payment transaction not found', 404);
  }

  if (role !== 'ADMIN' && payment.userId !== userId) {
    throw new AppError('You are not authorized to view this payment', 403);
  }

  return payment;
};

const getAllPaymentsFromDB = async () => {
  return prisma.payment.findMany({
    include: {
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const refundPaymentInDB = async (id: string, adminId: string) => {
  const payment = await prisma.payment.findUnique({ where: { id } });
  if (!payment) {
    throw new AppError('Payment transaction not found', 404);
  }

  return await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });


    await tx.auditLog.create({
      data: {
        userId: adminId,
        action: 'REFUND_PAYMENT',
        entity: 'Payment',
        entityId: id,
        details: `Refunded payment transaction ${payment.transactionId} of ${payment.amount} BDT`,
      },
    });

    return updatedPayment;
  });
};

export const PaymentService = {
  initiatePaymentInDB,
  verifyPaymentWebhookInDB,
  getAllPaymentsFromDB,
  getPaymentByIdFromDB,
  refundPaymentInDB,
};

