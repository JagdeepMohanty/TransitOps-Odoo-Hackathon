const prisma = require('../config/prisma');

const include = { vehicle: true };

const findAll = (filters = {}, skip, limit) =>
  prisma.maintenanceLog.findMany({ where: filters, include, skip, take: limit, orderBy: { createdAt: 'desc' } });

const countAll = (filters = {}) => prisma.maintenanceLog.count({ where: filters });

const findById = (id) => prisma.maintenanceLog.findUnique({ where: { id }, include });

const findActiveByVehicle = (vehicleId) =>
  prisma.maintenanceLog.findFirst({ where: { vehicleId, status: 'Active' } });

const create = (data) => prisma.maintenanceLog.create({ data, include });

const update = (id, data) => prisma.maintenanceLog.update({ where: { id }, data, include });

module.exports = { findAll, countAll, findById, findActiveByVehicle, create, update };
