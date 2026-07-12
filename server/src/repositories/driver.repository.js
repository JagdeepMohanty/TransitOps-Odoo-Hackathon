const prisma = require('../config/prisma');

const findAll = (filters = {}, skip, limit) =>
  prisma.driver.findMany({ where: filters, skip, take: limit, orderBy: { createdAt: 'desc' } });

const countAll = (filters = {}) => prisma.driver.count({ where: filters });

const findById = (id) => prisma.driver.findUnique({ where: { id } });

const findByLicense = (licenseNumber) =>
  prisma.driver.findUnique({ where: { licenseNumber } });

const findAvailable = () =>
  prisma.driver.findMany({ where: { status: 'Available' }, orderBy: { createdAt: 'desc' } });

const create = (data) => prisma.driver.create({ data });

const update = (id, data) => prisma.driver.update({ where: { id }, data });

const remove = (id) => prisma.driver.delete({ where: { id } });

const updateStatus = (id, status) => prisma.driver.update({ where: { id }, data: { status } });

module.exports = { findAll, countAll, findById, findByLicense, findAvailable, create, update, remove, updateStatus };
