import prisma from '../config/prisma.js';

const safeSelect = {
  id: true,
  name: true,
  email: true,
  roleId: true,
  role: { select: { name: true } },
  createdAt: true,
  updatedAt: true,
};

// Returns full record including passwordHash — for auth only
export const findUserByEmail = (email) =>
  prisma.user.findUnique({
    where: { email },
    include: { role: { select: { name: true } } },
  });

// Returns safe shape — no passwordHash
export const findUserById = (id) =>
  prisma.user.findUnique({ where: { id }, select: safeSelect });

// Lightweight existence check used by auth middleware
export const userExists = (id) =>
  prisma.user.findUnique({ where: { id }, select: { id: true } });
