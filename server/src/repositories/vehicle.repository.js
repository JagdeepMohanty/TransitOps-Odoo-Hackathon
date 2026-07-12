import prisma from '../config/prisma.js';

export const findAll = (filters = {}, skip, limit) =>
  prisma.vehicle.findMany({ where: filters, skip, take: limit, orderBy: { createdAt: 'desc' } });

export const countAll = (filters = {}) => prisma.vehicle.count({ where: filters });

export const findById = (id) => prisma.vehicle.findUnique({ where: { id } });

export const findByRegistration = (registrationNumber) =>
  prisma.vehicle.findUnique({ where: { registrationNumber } });

export const findAvailable = () =>
  prisma.vehicle.findMany({ where: { status: 'AVAILABLE' }, orderBy: { createdAt: 'desc' } });

export const create = (data) => prisma.vehicle.create({ data });

export const update = (id, data) => prisma.vehicle.update({ where: { id }, data });

export const remove = (id) => prisma.vehicle.delete({ where: { id } });

export const updateStatus = (id, status) => prisma.vehicle.update({ where: { id }, data: { status } });
