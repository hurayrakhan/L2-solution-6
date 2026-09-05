import { Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { UserService } from './user.service.js';

const getMyProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await UserService.getMyProfileFromDB(userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile retrieved successfully',
    data: result,
  });
});

const updateMyProfile = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const result = await UserService.updateMyProfileInDB(userId, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

export const UserController = {
  getMyProfile,
  updateMyProfile,
};
