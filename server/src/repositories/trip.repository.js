import prisma from '../config/prisma.js';

const include = { vehicle: true, driver: true };

export const findAll = (filters = {}, skip, limit) =>
  prisma.trip.findMany({ where: filters, include, skip, take: limit, orderBy: { createdAt: 'desc' } });

export const countAll = (filters = {}) => prisma.trip.count({ where: filters });

export const findById = (id) => prisma.trip.findUnique({ where: { id }, include });

export const create = (data) => prisma.trip.create({ data, include });

export const update = (id, data) => prisma.trip.update({ where: { id }, data, include });

export const remove = (id) => prisma.trip.delete({ where: { id } });
