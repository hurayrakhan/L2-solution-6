import { z } from 'zod';

export const PropertyValidation = {
  createPropertySchema: z.object({
    body: z.object({
      title: z.string({ required_error: 'Title is required' }),
      description: z.string({ required_error: 'Description is required' }),
      address: z.string({ required_error: 'Address is required' }),
      city: z.string({ required_error: 'City is required' }),
      area: z.string({ required_error: 'Area is required' }),
      propertyType: z.enum(['FLAT', 'SUBLET', 'MESS']).default('FLAT'),
      rentAmount: z.number({ required_error: 'Rent amount is required' }).positive(),
      bedrooms: z.number().int().min(1).default(1),
      bathrooms: z.number().int().min(1).default(1),
    }),
  }),
  updatePropertySchema: z.object({
    body: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      address: z.string().optional(),
      city: z.string().optional(),
      area: z.string().optional(),
      propertyType: z.enum(['FLAT', 'SUBLET', 'MESS']).optional(),
      rentAmount: z.number().positive().optional(),
      bedrooms: z.number().int().min(1).optional(),
      bathrooms: z.number().int().min(1).optional(),
      isAvailable: z.boolean().optional(),
    }),
  }),
};
