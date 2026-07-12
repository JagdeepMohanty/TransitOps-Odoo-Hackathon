import prisma from '../config/prisma.js';

export const findAll = (where = {}, skip, limit, orderBy = { createdAt: 'desc' }) =>
  prisma.vehicle.findMany({ where, skip, take: limit, orderBy });

export const countAll = (where = {}) => prisma.vehicle.count({ where });

export const findById = (id) => prisma.vehicle.findUnique({ where: { id } });

export const findByRegistration = (registrationNumber) =>
  prisma.vehicle.findUnique({ where: { registrationNumber } });

export const findAvailable = () =>
  prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { name: 'asc' },
    select: { id: true, registrationNumber: true, name: true, type: true, maxLoadCapacity: true, status: true },
  });

export const create = (data) => prisma.vehicle.create({ data });

export const update = (id, data) => prisma.vehicle.update({ where: { id }, data });

export const remove = (id) => prisma.vehicle.delete({ where: { id } });

export const updateStatus = (id, status) =>
  prisma.vehicle.update({ where: { id }, data: { status } });

export const hasActiveTrip = (id) =>
  prisma.trip.findFirst({
    where: { vehicleId: id, status: { in: ['DRAFT', 'DISPATCHED'] } },
    select: { id: true },
  });

export const hasActiveMaintenance = (id) =>
  prisma.maintenance.findFirst({
    where: { vehicleId: id, status: 'ACTIVE' },
    select: { id: true },
  });
