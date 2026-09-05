import { Response } from 'express';
import { CustomRequest } from '../../middlewares/auth.middleware.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { sendResponse } from '../../utils/sendResponse.js';
import { BookingService } from './booking.service.js';

const createBooking = catchAsync(async (req: CustomRequest, res: Response) => {
  const tenantId = req.user!.id;
  const result = await BookingService.createBookingInDB(tenantId, req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Transport booking created with escrow hold successfully',
    data: result,
  });
});

const getMyBookings = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user!.id;
  const role = req.user!.role;
  const result = await BookingService.getMyBookingsFromDB(userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

const getBookingById = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const result = await BookingService.getBookingByIdFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking details retrieved successfully',
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.id;
  const role = req.user!.role;
  const { status } = req.body;
  const result = await BookingService.updateBookingStatusInDB(id, userId, role, status);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Booking status updated to ${status} successfully`,
    data: result,
  });
});

export const BookingController = {
  createBooking,
  getMyBookings,
  getBookingById,
  updateBookingStatus,
};
