import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

const ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

const USERS = [
  { name: 'Fleet Manager',    email: 'fleet@transitops.com',      password: 'Fleet@123',      role: 'FLEET_MANAGER' },
  { name: 'Dispatcher',       email: 'dispatcher@transitops.com', password: 'Dispatcher@123', role: 'DISPATCHER' },
  { name: 'Safety Officer',   email: 'safety@transitops.com',     password: 'Safety@123',     role: 'SAFETY_OFFICER' },
  { name: 'Finance Analyst',  email: 'finance@transitops.com',    password: 'Finance@123',    role: 'FINANCIAL_ANALYST' },
];

async function main() {
  // ── 1. Seed roles ──────────────────────────────────────────────────────────
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('✅  Roles seeded:', ROLES.join(', '));

  // ── 2. Seed demo users ─────────────────────────────────────────────────────
  for (const u of USERS) {
    const role = await prisma.role.findUnique({ where: { name: u.role } });
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);

    await prisma.user.upsert({
      where:  { email: u.email },
      update: { name: u.name, passwordHash, roleId: role.id },
      create: { name: u.name, email: u.email, passwordHash, roleId: role.id },
    });

    console.log(`✅  User seeded: ${u.email} (${u.role})`);
  }
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
