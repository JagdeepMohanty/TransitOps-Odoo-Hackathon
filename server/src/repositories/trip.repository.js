const prisma = require('../config/prisma');

const include = { vehicle: true, driver: true };

const findAll = (filters = {}, skip, limit) =>
  prisma.trip.findMany({ where: filters, include, skip, take: limit, orderBy: { createdAt: 'desc' } });

const countAll = (filters = {}) => prisma.trip.count({ where: filters });

const findById = (id) => prisma.trip.findUnique({ where: { id }, include });

const create = (data) => prisma.trip.create({ data, include });

const update = (id, data) => prisma.trip.update({ where: { id }, data, include });

const remove = (id) => prisma.trip.delete({ where: { id } });

module.exports = { findAll, countAll, findById, create, update, remove };
