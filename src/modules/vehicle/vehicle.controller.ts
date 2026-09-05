import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { VehicleService } from './vehicle.service.js';

const createVehicle = catchAsync(async (req: CustomRequest, res: Response) => {
  const ownerId = req.user!.id;
  const result = await VehicleService.createVehicleInDB(ownerId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Vehicle listed successfully',
    data: result,
  });
});

const getAllVehicles = catchAsync(async (req: Request, res: Response) => {
  const result = await VehicleService.getAllVehiclesFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vehicles retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getVehicleById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await VehicleService.getVehicleByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vehicle details retrieved successfully',
    data: result,
  });
});

const updateVehicle = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const ownerId = req.user!.id;
  const role = req.user!.role;
  const result = await VehicleService.updateVehicleInDB(id, ownerId, role, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vehicle updated successfully',
    data: result,
  });
});

const deleteVehicle = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const ownerId = req.user!.id;
  const role = req.user!.role;
  await VehicleService.deleteVehicleFromDB(id, ownerId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Vehicle soft deleted successfully',
    data: null,
  });
});

export const VehicleController = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
