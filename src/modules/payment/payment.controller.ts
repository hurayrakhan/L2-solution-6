import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { PaymentService } from './payment.service.js';

const initiatePayment = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await PaymentService.initiatePaymentInDB(userId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Payment session initiated successfully',
    data: result,
  });
});

const verifyPaymentWebhook = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentService.verifyPaymentWebhookInDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment webhook processed and status updated successfully',
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const role = req.user!.role;
  const result = await PaymentService.getPaymentByIdFromDB(id, userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment details retrieved successfully',
    data: result,
  });
});

const getAllPayments = catchAsync(async (req: CustomRequest, res: Response) => {
  const result = await PaymentService.getAllPaymentsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All payment records retrieved successfully',
    data: result,
  });
});

const refundPayment = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const adminId = req.user!.id;
  const result = await PaymentService.refundPaymentInDB(id, adminId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment transaction marked as refunded successfully',
    data: result,
  });
});

export const PaymentController = {
  initiatePayment,
  verifyPaymentWebhook,
  getAllPayments,
  getPaymentById,
  refundPayment,
};

