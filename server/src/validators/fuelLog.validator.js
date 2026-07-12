import { z } from 'zod';

export const createFuelLogSchema = z.object({
  vehicleId: z.number().int().positive(),
  tripId: z.number().int().positive().optional(),
  liters: z.number().positive(),
  cost: z.number().min(0),
  odometer: z.number().min(0).optional(),
  logDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});
