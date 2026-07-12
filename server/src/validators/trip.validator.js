const { z } = require('zod');

const createTripSchema = z.object({
  source: z.string().min(1),
  destination: z.string().min(1),
  vehicleId: z.number().int().positive(),
  driverId: z.number().int().positive(),
  cargoWeight: z.number().positive(),
  plannedDistance: z.number().positive(),
  revenue: z.number().min(0).default(0),
});

const completeTripSchema = z.object({
  finalDistance: z.number().positive(),
  fuelConsumed: z.number().positive(),
  fuelCost: z.number().min(0),
  revenue: z.number().min(0).optional(),
});

const updateTripSchema = createTripSchema.partial();

module.exports = { createTripSchema, updateTripSchema, completeTripSchema };