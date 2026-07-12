import prisma from '../config/prisma.js';

export const findAll = (where = {}, skip, limit, orderBy = { createdAt: 'desc' }) =>
  prisma.driver.findMany({ where, skip, take: limit, orderBy });

export const countAll = (where = {}) => prisma.driver.count({ where });

export const findById = (id) => prisma.driver.findUnique({ where: { id } });

export const findByLicense = (licenseNumber) =>
  prisma.driver.findUnique({ where: { licenseNumber } });

export const findAvailable = () =>
  prisma.driver.findMany({
    where: {
      status: 'AVAILABLE',
      licenseExpiryDate: { gt: new Date() },
    },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      licenseNumber: true,
      licenseCategory: true,
      licenseExpiryDate: true,
      status: true,
    },
  });

export const create = (data) => prisma.driver.create({ data });

export const update = (id, data) => prisma.driver.update({ where: { id }, data });

export const remove = (id) => prisma.driver.delete({ where: { id } });

export const updateStatus = (id, status) =>
  prisma.driver.update({ where: { id }, data: { status } });

export const hasActiveTrip = (id) =>
  prisma.trip.findFirst({
    where: { driverId: id, status: { in: ['DRAFT', 'DISPATCHED'] } },
    select: { id: true },
  });
