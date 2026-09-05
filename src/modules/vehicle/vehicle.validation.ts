import { z } from 'zod';

export const VehicleValidation = {
  createVehicleSchema: z.object({
    body: z.object({
      title: z.string({ required_error: 'Vehicle title is required' }),
      vehicleType: z.enum(['PICKUP_TRUCK', 'COVERED_VAN', 'PASSENGER_CAR', 'MICROBUS']),
      licensePlate: z.string({ required_error: 'License plate is required' }),
      capacity: z.string({ required_error: 'Capacity description is required' }),
      driverName: z.string({ required_error: 'Driver name is required' }),
      driverPhone: z.string({ required_error: 'Driver phone is required' }),
      hourlyRate: z.number().positive(),
      perKmRate: z.number().positive(),
    }),
  }),
  updateVehicleSchema: z.object({
    body: z.object({
      title: z.string().optional(),
      vehicleType: z.enum(['PICKUP_TRUCK', 'COVERED_VAN', 'PASSENGER_CAR', 'MICROBUS']).optional(),
      licensePlate: z.string().optional(),
      capacity: z.string().optional(),
      driverName: z.string().optional(),
      driverPhone: z.string().optional(),
      hourlyRate: z.number().positive().optional(),
      perKmRate: z.number().positive().optional(),
      isAvailable: z.boolean().optional(),
    }),
  }),
};
