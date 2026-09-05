import { z } from 'zod';

export const UtilityValidation = {
  createUtilityBillSchema: z.object({
    body: z.object({
      propertyId: z.string({ required_error: 'Property ID is required' }),
      month: z.string({ required_error: 'Month is required' }),
      year: z.number({ required_error: 'Year is required' }),
      electricityBill: z.number().min(0).default(0),
      gasBill: z.number().min(0).default(0),
      waterBill: z.number().min(0).default(0),
      maidSalary: z.number().min(0).default(0),
      tenantCount: z.number({ required_error: 'Tenant count is required' }).int().min(1),
    }),
  }),
};
