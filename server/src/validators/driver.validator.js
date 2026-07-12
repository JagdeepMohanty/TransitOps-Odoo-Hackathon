import { z } from 'zod';
import { DRIVER_STATUS } from '../constants/statuses.js';

export const createDriverSchema = z.object({
  name:              z.string().min(1, 'Name is required'),
  licenseNumber:     z.string().min(1, 'License number is required'),
  licenseCategory:   z.string().min(1, 'License category is required'),
  licenseExpiryDate: z
    .string()
    .min(1, 'License expiry date is required')
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  contactNumber:     z.string().min(1, 'Contact number is required'),
  safetyScore:       z.number().int().min(0).max(100).default(100),
});

export const updateDriverSchema = createDriverSchema
  .partial()
  .extend({
    status: z.enum(Object.values(DRIVER_STATUS)).optional(),
  });
