import { z } from 'zod';

export const reportFilterSchema = z.object({
  vehicleId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
