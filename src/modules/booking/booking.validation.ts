import { z } from 'zod';

export const BookingValidation = {
  createBookingSchema: z.object({
    body: z.object({
      vehicleId: z.string({ required_error: 'Vehicle ID is required' }),
      bookingType: z.enum(['HOUSE_SHIFTING', 'PASSENGER_TRAVEL']).default('HOUSE_SHIFTING'),
      pickupAddress: z.string({ required_error: 'Pickup address is required' }),
      dropoffAddress: z.string({ required_error: 'Dropoff address is required' }),
      shiftingDate: z.string({ required_error: 'Shifting date is required' }),
      laborCount: z.number().int().min(0).default(0),
      totalAmount: z.number({ required_error: 'Total amount is required' }).positive(),
    }),
  }),
  updateBookingStatusSchema: z.object({
    body: z.object({
      status: z.enum(['ACCEPTED', 'IN_TRANSIT', 'COMPLETED', 'CANCELLED']),
    }),
  }),
};
