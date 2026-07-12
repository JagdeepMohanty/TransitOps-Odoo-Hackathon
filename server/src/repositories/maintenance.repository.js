import prisma from '../config/prisma.js';

const include = { vehicle: true };

export const findAll = (filters = {}, skip, limit) =>
  prisma.maintenance.findMany({ where: filters, include, skip, take: limit, orderBy: { createdAt: 'desc' } });

export const countAll = (filters = {}) => prisma.maintenance.count({ where: filters });

export const findById = (id) => prisma.maintenance.findUnique({ where: { id }, include });

export const findActiveByVehicle = (vehicleId) =>
  prisma.maintenance.findFirst({ where: { vehicleId, status: 'ACTIVE' } });

export const create = (data) => prisma.maintenance.create({ data, include });

export const update = (id, data) => prisma.maintenance.update({ where: { id }, data, include });

export const sumByVehicle = (vehicleId) =>
  prisma.maintenance.aggregate({
    where: { vehicleId },
    _sum: { cost: true },
  });
