import { z } from 'zod';

export const createMaintenanceSchema = z.object({
  vehicleId: z.number().int().positive(),
  maintenanceType: z.string().min(1),
  description: z.string().optional(),
  cost: z.number().min(0).default(0),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  notes: z.string().optional(),
});

export const closeMaintenanceSchema = z.object({
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }).optional(),
  cost: z.number().min(0).optional(),
  notes: z.string().optional(),
});
