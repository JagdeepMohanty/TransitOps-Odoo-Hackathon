const prisma = require('../config/prisma');

const include = { vehicle: true, trip: true };

const findAll = (filters = {}, skip, limit) =>
  prisma.expense.findMany({ where: filters, include, skip, take: limit, orderBy: { date: 'desc' } });

const countAll = (filters = {}) => prisma.expense.count({ where: filters });

const findById = (id) => prisma.expense.findUnique({ where: { id }, include });

const findByVehicle = (vehicleId) =>
  prisma.expense.findMany({ where: { vehicleId }, orderBy: { date: 'desc' } });

const create = (data) => prisma.expense.create({ data, include });

const sumByVehicle = (vehicleId) =>
  prisma.expense.aggregate({
    where: { vehicleId },
    _sum: { amount: true },
  });

const sumMaintenanceByVehicle = (vehicleId) =>
  prisma.expense.aggregate({
    where: { vehicleId, type: 'Maintenance' },
    _sum: { amount: true },
  });

module.exports = { findAll, countAll, findById, findByVehicle, create, sumByVehicle, sumMaintenanceByVehicle };
