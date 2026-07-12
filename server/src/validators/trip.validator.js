import { z } from 'zod';

export const createTripSchema = z.object({
  source:          z.string().min(1, 'Source is required'),
  destination:     z.string().min(1, 'Destination is required'),
  vehicleId:       z.number().int().positive('Vehicle ID must be a positive integer'),
  driverId:        z.number().int().positive('Driver ID must be a positive integer'),
  cargoWeight:     z.number().positive('Cargo weight must be greater than 0'),
  plannedDistance: z.number().positive('Planned distance must be greater than 0'),
  revenue:         z.number().min(0, 'Revenue must be 0 or greater').optional(),
});

export const updateTripSchema = z.object({
  source:          z.string().min(1).optional(),
  destination:     z.string().min(1).optional(),
  vehicleId:       z.number().int().positive().optional(),
  driverId:        z.number().int().positive().optional(),
  cargoWeight:     z.number().positive().optional(),
  plannedDistance: z.number().positive().optional(),
  revenue:         z.number().min(0).optional(),
});

export const completeTripSchema = z.object({
  actualDistance: z.number().positive('Actual distance must be greater than 0'),
  fuelConsumed:   z.number().min(0, 'Fuel consumed must be 0 or greater'),
  finalOdometer:  z.number().min(0, 'Final odometer must be 0 or greater'),
  revenue:        z.number().min(0, 'Revenue must be 0 or greater').optional(),
});

export const cancelTripSchema = z.object({
  reason: z.string().min(1).optional(),
});
