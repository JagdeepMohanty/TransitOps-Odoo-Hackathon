import { z } from 'zod';

export const DRIVER_STATUS_VALUES = ['AVAILABLE', 'ON_TRIP', 'OFF_DUTY', 'SUSPENDED'];

export const createDriverSchema = z.object({
  name:              z.string().min(1, 'Full name is required'),
  licenseNumber:     z.string().min(1, 'License number is required'),
  licenseCategory:   z.string().min(1, 'License category is required'),
  licenseExpiryDate: z.string().refine(
    (v) => !isNaN(Date.parse(v)) && new Date(v) > new Date(),
    { message: 'License expiry must be a valid future date' }
  ),
  contactNumber:     z.string().min(1, 'Contact number is required'),
  safetyScore:       z.coerce.number().int().min(0).max(100).default(100),
});

export const updateDriverSchema = createDriverSchema.partial().extend({
  status: z.enum(DRIVER_STATUS_VALUES).optional(),
});
