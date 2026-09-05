import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { AdminService } from './admin.service.js';

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getDashboardStatsFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin dashboard statistics retrieved successfully',
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const verifyProvider = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await AdminService.verifyProviderInDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Provider verified successfully',
    data: result,
  });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminService.getAuditLogsFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'System audit logs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const AdminController = {
  getDashboardStats,
  getAllUsers,
  verifyProvider,
  getAuditLogs,
};
