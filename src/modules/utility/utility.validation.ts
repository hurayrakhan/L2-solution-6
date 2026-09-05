import { z } from 'zod';

export const UtilityValidation = {
  createUtilityBillSchema: z.object({
    body: z.object({
      propertyId: z.string().min(1, 'Property ID is required'),
      month: z.string().min(1, 'Month is required'),
      year: z.number().int().min(2020),
      electricityBill: z.number().min(0).default(0),
      gasBill: z.number().min(0).default(0),
      waterBill: z.number().min(0).default(0),
      maidSalary: z.number().min(0).default(0),
      tenantCount: z.number().int().min(1),
    }),
  }),
};
