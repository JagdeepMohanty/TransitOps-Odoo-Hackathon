import prisma from '../config/prisma.js';

export const findAll = (filters = {}, skip, limit) =>
  prisma.driver.findMany({ where: filters, skip, take: limit, orderBy: { createdAt: 'desc' } });

export const countAll = (filters = {}) => prisma.driver.count({ where: filters });

export const findById = (id) => prisma.driver.findUnique({ where: { id } });

export const findByLicense = (licenseNumber) =>
  prisma.driver.findUnique({ where: { licenseNumber } });

export const findAvailable = () =>
  prisma.driver.findMany({ where: { status: 'AVAILABLE' }, orderBy: { createdAt: 'desc' } });

export const create = (data) => prisma.driver.create({ data });

export const update = (id, data) => prisma.driver.update({ where: { id }, data });

export const remove = (id) => prisma.driver.delete({ where: { id } });

export const updateStatus = (id, status) => prisma.driver.update({ where: { id }, data: { status } });
