const prisma = require('../config/prisma');

const include = { vehicle: true, trip: true };

const findAll = (filters = {}, skip, limit) =>
  prisma.fuelLog.findMany({ where: filters, include, skip, take: limit, orderBy: { date: 'desc' } });

const countAll = (filters = {}) => prisma.fuelLog.count({ where: filters });

const findById = (id) => prisma.fuelLog.findUnique({ where: { id }, include });

const findByVehicle = (vehicleId) =>
  prisma.fuelLog.findMany({ where: { vehicleId }, orderBy: { date: 'desc' } });

const create = (data) => prisma.fuelLog.create({ data, include });

const sumByVehicle = (vehicleId) =>
  prisma.fuelLog.aggregate({
    where: { vehicleId },
    _sum: { liters: true, cost: true },
  });

module.exports = { findAll, countAll, findById, findByVehicle, create, sumByVehicle };
