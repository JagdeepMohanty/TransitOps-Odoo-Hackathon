const { z } = require('zod');

const createMaintenanceSchema = z.object({
  vehicleId: z.number().int().positive(),
  maintenanceType: z.string().min(1),
  description: z.string().optional(),
  cost: z.number().min(0).default(0),
  startDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
});

const closeMaintenanceSchema = z.object({
  endDate: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  cost: z.number().min(0).optional(),
});

module.exports = { createMaintenanceSchema, closeMaintenanceSchema };
