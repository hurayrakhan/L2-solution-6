import { Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { UtilityService } from './utility.service.js';

const createUtilityBill = catchAsync(async (req: CustomRequest, res: Response) => {
  const landlordId = req.user!.id;
  const result = await UtilityService.createUtilityBillInDB(landlordId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Monthly utility bill calculated and created successfully',
    data: result,
  });
});

const getMyUtilityBills = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const result = await UtilityService.getMyUtilityBillsFromDB(userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Utility bills retrieved successfully',
    data: result,
  });
});

const getUtilityBillById = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const result = await UtilityService.getUtilityBillByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Utility bill details retrieved successfully',
    data: result,
  });
});

export const UtilityController = {
  createUtilityBill,
  getMyUtilityBills,
  getUtilityBillById,
};
