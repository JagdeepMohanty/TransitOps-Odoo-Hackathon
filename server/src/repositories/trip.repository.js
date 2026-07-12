import prisma from '../config/prisma.js';

// Lean include — only the fields the frontend actually needs from related records
const include = {
  vehicle: {
    select: {
      id: true,
      registrationNumber: true,
      name: true,
      type: true,
      maxLoadCapacity: true,
      status: true,
    },
  },
  driver: {
    select: {
      id: true,
      name: true,
      licenseNumber: true,
      licenseCategory: true,
      licenseExpiryDate: true,
      status: true,
    },
  },
};

export const findAll = (where = {}, skip, limit, orderBy = { createdAt: 'desc' }) =>
  prisma.trip.findMany({ where, include, skip, take: limit, orderBy });

export const countAll = (where = {}) => prisma.trip.count({ where });

export const findById = (id) => prisma.trip.findUnique({ where: { id }, include });

export const create = (data) => prisma.trip.create({ data, include });

export const update = (id, data) => prisma.trip.update({ where: { id }, data, include });

export const remove = (id) => prisma.trip.delete({ where: { id } });
