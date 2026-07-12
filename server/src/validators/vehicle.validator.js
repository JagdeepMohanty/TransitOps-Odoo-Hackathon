import { z } from 'zod';
import { VEHICLE_STATUS } from '../constants/statuses.js';

export const createVehicleSchema = z.object({
<<<<<<< Updated upstream
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
=======
  registrationNumber: z.string().min(1, 'Registration number is required').max(50),
  name:               z.string().min(1, 'Name is required'),
  model:              z.string().optional(),
  type:               z.string().min(1, 'Type is required'),
  region:             z.string().optional(),
  maxLoadCapacity:    z.number().positive('Max load capacity must be greater than 0'),
  acquisitionCost:    z.number().positive('Acquisition cost must be greater than 0'),
  odometer:           z.number().min(0, 'Odometer must be 0 or greater').default(0),
});

export const updateVehicleSchema = createVehicleSchema
  .partial()
  .extend({
    status: z.enum(Object.values(VEHICLE_STATUS)).optional(),
  });
>>>>>>> Stashed changes
