import { z } from 'zod';

export const PropertyValidation = {
  createPropertySchema: z.object({
    body: z.object({
      title: z.string().min(1, 'Title is required'),
      description: z.string().min(1, 'Description is required'),
      address: z.string().min(1, 'Address is required'),
      city: z.string().min(1, 'City is required'),
      area: z.string().min(1, 'Area is required'),
      propertyType: z.enum(['FLAT', 'SUBLET', 'MESS']).default('FLAT'),
      rentAmount: z.number({ invalid_type_error: 'Rent amount must be a number' }).positive(),
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
