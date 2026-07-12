import { z } from 'zod';

export const VEHICLE_STATUS_VALUES = ['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED'];

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1, 'Registration number is required').max(50),
  name:               z.string().min(1, 'Name is required'),
  model:              z.string().optional(),
  type:               z.string().min(1, 'Vehicle type is required'),
  region:             z.string().optional(),
  maxLoadCapacity:    z.coerce.number().positive('Max load capacity must be > 0'),
  acquisitionCost:    z.coerce.number().positive('Acquisition cost must be > 0'),
  odometer:           z.coerce.number().min(0, 'Odometer must be ≥ 0').default(0),
});

export const updateVehicleSchema = createVehicleSchema.partial().extend({
  status: z.enum(VEHICLE_STATUS_VALUES).optional(),
});
