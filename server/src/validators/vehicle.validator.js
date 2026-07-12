import { z } from 'zod';

export const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  name: z.string().min(1),
  model: z.string().optional(),
  type: z.string().min(1),
  region: z.string().optional(),
  maxLoadCapacity: z.number().positive(),
  odometer: z.number().min(0).default(0),
  acquisitionCost: z.number().positive(),
  status: z.enum(['AVAILABLE', 'ON_TRIP', 'IN_SHOP', 'RETIRED']).default('AVAILABLE'),
});

export const updateVehicleSchema = createVehicleSchema.partial();
