import { Request, Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { PropertyService } from './property.service.js';

const createProperty = catchAsync(async (req: CustomRequest, res: Response) => {
  const landlordId = req.user!.id;
  const result = await PropertyService.createPropertyInDB(landlordId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Property listing created successfully',
    data: result,
  });
});

const getAllProperties = catchAsync(async (req: Request, res: Response) => {
  const result = await PropertyService.getAllPropertiesFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Properties retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getPropertyById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const result = await PropertyService.getPropertyByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property details retrieved successfully',
    data: result,
  });
});

const updateProperty = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const result = await PropertyService.updatePropertyInDB(id, userId, userRole, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property updated successfully',
    data: result,
  });
});

const deleteProperty = catchAsync(async (req: CustomRequest, res: Response) => {
  const id = req.params.id as string;
  const userId = req.user!.id;
  const userRole = req.user!.role;
  await PropertyService.deletePropertyFromDB(id, userId, userRole);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Property soft deleted successfully',
    data: null,
  });
});

export const PropertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
