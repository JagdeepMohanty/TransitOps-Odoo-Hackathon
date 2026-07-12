const { z } = require('zod');

const createVehicleSchema = z.object({
  registrationNumber: z.string().min(1),
  vehicleName: z.string().min(1),
  model: z.string().min(1),
  type: z.string().min(1),
  region: z.string().optional(),
  maxLoadCapacity: z.number().positive(),
  odometer: z.number().min(0).default(0),
  acquisitionCost: z.number().positive(),
  status: z.enum(['Available', 'On Trip', 'In Shop', 'Retired']).default('Available'),
});

const updateVehicleSchema = createVehicleSchema.partial();

module.exports = { createVehicleSchema, updateVehicleSchema };
