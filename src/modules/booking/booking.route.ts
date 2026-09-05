import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { BookingController } from './booking.controller.js';
import { BookingValidation } from './booking.validation.js';

const router = Router();

router.post(
  '/',
  auth('TENANT_USER', 'ADMIN'),
  validateRequest(BookingValidation.createBookingSchema),
  BookingController.createBooking
);

router.get('/my-bookings', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), BookingController.getMyBookings);
router.get('/:id', auth('TENANT_USER', 'PROVIDER', 'ADMIN'), BookingController.getBookingById);

router.patch(
  '/:id/status',
  auth('TENANT_USER', 'PROVIDER', 'ADMIN'),
  validateRequest(BookingValidation.updateBookingStatusSchema),
  BookingController.updateBookingStatus
);

export default router;
