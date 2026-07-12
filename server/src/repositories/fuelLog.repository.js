import prisma from '../config/prisma.js';

const include = { vehicle: true, trip: true };

export const findAll = (filters = {}, skip, limit) =>
  prisma.fuelLog.findMany({ where: filters, include, skip, take: limit, orderBy: { logDate: 'desc' } });

export const countAll = (filters = {}) => prisma.fuelLog.count({ where: filters });

export const findById = (id) => prisma.fuelLog.findUnique({ where: { id }, include });

export const findByVehicle = (vehicleId) =>
  prisma.fuelLog.findMany({ where: { vehicleId }, orderBy: { logDate: 'desc' } });

export const create = (data) => prisma.fuelLog.create({ data, include });

export const sumByVehicle = (vehicleId) =>
  prisma.fuelLog.aggregate({
    where: { vehicleId },
    _sum: { liters: true, cost: true },
  });
