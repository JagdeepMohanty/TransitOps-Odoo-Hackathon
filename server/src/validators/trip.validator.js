import { z } from 'zod';

export const createTripSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicleId: z.number().int().positive(),
  driverId: z.number().int().positive(),
  cargoWeight: z.number().positive(),
  plannedDistance: z.number().positive(),
  revenue: z.number().min(0).default(0),
});

export const completeTripSchema = z.object({
  actualDistance: z.number().positive(),
  fuelConsumed: z.number().positive(),
  revenue: z.number().min(0).optional(),
});

export const updateTripSchema = createTripSchema.partial();
