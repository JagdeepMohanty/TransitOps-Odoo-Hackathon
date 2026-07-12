const prisma = require('../config/prisma');

const findAll = (filters = {}, skip, limit) =>
  prisma.vehicle.findMany({ where: filters, skip, take: limit, orderBy: { createdAt: 'desc' } });

const countAll = (filters = {}) => prisma.vehicle.count({ where: filters });

const findById = (id) => prisma.vehicle.findUnique({ where: { id } });

const findByRegistration = (registrationNumber) =>
  prisma.vehicle.findUnique({ where: { registrationNumber } });

const findAvailable = () =>
  prisma.vehicle.findMany({ where: { status: 'Available' }, orderBy: { createdAt: 'desc' } });

const create = (data) => prisma.vehicle.create({ data });

const update = (id, data) => prisma.vehicle.update({ where: { id }, data });

const remove = (id) => prisma.vehicle.delete({ where: { id } });

const updateStatus = (id, status) => prisma.vehicle.update({ where: { id }, data: { status } });

module.exports = { findAll, countAll, findById, findByRegistration, findAvailable, create, update, remove, updateStatus };
