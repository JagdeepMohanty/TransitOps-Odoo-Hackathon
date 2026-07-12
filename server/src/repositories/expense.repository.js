import prisma from '../config/prisma.js';

const include = { vehicle: true, trip: true };

export const findAll = (filters = {}, skip, limit) =>
  prisma.expense.findMany({ where: filters, include, skip, take: limit, orderBy: { expenseDate: 'desc' } });

export const countAll = (filters = {}) => prisma.expense.count({ where: filters });

export const findById = (id) => prisma.expense.findUnique({ where: { id }, include });

export const findByVehicle = (vehicleId) =>
  prisma.expense.findMany({ where: { vehicleId }, orderBy: { expenseDate: 'desc' } });

export const create = (data) => prisma.expense.create({ data, include });

export const sumByVehicle = (vehicleId) =>
  prisma.expense.aggregate({
    where: { vehicleId },
    _sum: { amount: true },
  });

export const sumMaintenanceByVehicle = (vehicleId) =>
  prisma.expense.aggregate({
    where: { vehicleId, type: 'MAINTENANCE' },
    _sum: { amount: true },
  });
