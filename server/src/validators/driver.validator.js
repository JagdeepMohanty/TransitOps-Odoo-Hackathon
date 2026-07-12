import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.string().min(1),
  licenseExpiryDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  contactNumber: z.string().min(1),
  safetyScore: z.number().min(0).max(100).default(100),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED']).default('AVAILABLE'),
});

export const updateDriverSchema = createDriverSchema.partial();
