import prisma from '../config/prisma.js';

// Safe user shape returned to callers — never includes passwordHash
const safeSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  role: { select: { name: true } },
  createdAt: true,
  updatedAt: true,
};

export const findUserByEmail = (email) =>
  prisma.user.findUnique({ where: { email } });

export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id }, select: safeSelect });

export const userExists = (id) =>
  prisma.user.findUnique({ where: { id }, select: { id: true } });
