import { z } from 'zod';

export const BookingValidation = {
  createBookingSchema: z.object({
    body: z.object({
      vehicleId: z.string().min(1, 'Vehicle ID is required'),
      bookingType: z.enum(['HOUSE_SHIFTING', 'PASSENGER_TRAVEL']).default('HOUSE_SHIFTING'),
      pickupAddress: z.string().min(1, 'Pickup address is required'),
      dropoffAddress: z.string().min(1, 'Dropoff address is required'),
      shiftingDate: z.string().min(1, 'Shifting date is required'),
      laborCount: z.number().int().min(0).default(0),
      totalAmount: z.number().positive(),
    }),
  }),
  updateBookingStatusSchema: z.object({
    body: z.object({
      status: z.enum(['ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']),
    }),
  }),
};
