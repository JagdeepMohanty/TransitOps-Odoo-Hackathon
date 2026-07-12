const { z } = require('zod');

const reportFilterSchema = z.object({
  vehicleId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

module.exports = { reportFilterSchema };
