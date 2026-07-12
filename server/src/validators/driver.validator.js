const { z } = require('zod');

const createDriverSchema = z.object({
  name: z.string().min(1),
  licenseNumber: z.string().min(1),
  licenseCategory: z.string().min(1),
  licenseExpiry: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' }),
  contactNumber: z.string().min(1),
  safetyScore: z.number().min(0).max(100).default(100),
  status: z.enum(['Available', 'On Trip', 'Off Duty', 'Suspended']).default('Available'),
});

const updateDriverSchema = createDriverSchema.partial();

module.exports = { createDriverSchema, updateDriverSchema };
