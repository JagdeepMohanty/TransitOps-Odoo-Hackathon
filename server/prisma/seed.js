import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

// ── Roles ──────────────────────────────────────────────────────────────────────
const ROLES = ['FLEET_MANAGER', 'DISPATCHER', 'SAFETY_OFFICER', 'FINANCIAL_ANALYST'];

// ── Demo users — emails and passwords MUST NOT change ─────────────────────────
const USERS = [
  { name: 'Arjun Sharma',  email: 'fleet@transitops.com',      password: 'Fleet@123',      role: 'FLEET_MANAGER'     },
  { name: 'Priya Patel',   email: 'dispatcher@transitops.com', password: 'Dispatcher@123', role: 'DISPATCHER'        },
  { name: 'Rohan Verma',   email: 'safety@transitops.com',     password: 'Safety@123',     role: 'SAFETY_OFFICER'    },
  { name: 'Sneha Iyer',    email: 'finance@transitops.com',    password: 'Finance@123',    role: 'FINANCIAL_ANALYST' },
];

// ── Vehicles ───────────────────────────────────────────────────────────────────
const VEHICLES = [
  {
    registrationNumber: 'GJ01AB1001',
    name:               'Tata Prima 4028',
    model:              'Prima 4028.S',
    type:               'Heavy Truck',
    region:             'Ahmedabad',
    maxLoadCapacity:    28000,
    acquisitionCost:    3500000,
    odometer:           48200,
    status:             'AVAILABLE',
  },
  {
    registrationNumber: 'GJ05CD2205',
    name:               'Ashok Leyland 2518',
    model:              '2518 IL',
    type:               'Heavy Truck',
    region:             'Surat',
    maxLoadCapacity:    25000,
    acquisitionCost:    3200000,
    odometer:           62100,
    status:             'AVAILABLE',
  },
  {
    registrationNumber: 'MH12EF4508',
    name:               'Mahindra Blazo X 28',
    model:              'Blazo X 28',
    type:               'Medium Truck',
    region:             'Pune',
    maxLoadCapacity:    16000,
    acquisitionCost:    2100000,
    odometer:           21500,
    status:             'AVAILABLE',
  },
  {
    registrationNumber: 'DL01GH7821',
    name:               'Eicher Pro 6031',
    model:              'Pro 6031',
    type:               'Medium Truck',
    region:             'Delhi',
    maxLoadCapacity:    14000,
    acquisitionCost:    1950000,
    odometer:           89300,
    status:             'AVAILABLE',
  },
];

// ── Drivers ────────────────────────────────────────────────────────────────────
const DRIVERS = [
  {
    name:              'Vikram Singh',
    licenseNumber:     'DL0120230001234',
    licenseCategory:   'HMV',
    licenseExpiryDate: new Date('2027-06-30'),
    contactNumber:     '9876543210',
    safetyScore:       95,
    status:            'AVAILABLE',
  },
  {
    name:              'Ananya Das',
    licenseNumber:     'GJ0120240005678',
    licenseCategory:   'HMV',
    licenseExpiryDate: new Date('2028-03-15'),
    contactNumber:     '9823456701',
    safetyScore:       98,
    status:            'AVAILABLE',
  },
  {
    name:              'Rahul Mehta',
    licenseNumber:     'MH1220220009012',
    licenseCategory:   'HGMV',
    licenseExpiryDate: new Date('2026-11-20'),
    contactNumber:     '9712345678',
    safetyScore:       88,
    status:            'AVAILABLE',
  },
  {
    name:              'Kavya Nair',
    licenseNumber:     'KL0120230003456',
    licenseCategory:   'HTV',
    licenseExpiryDate: new Date('2027-09-10'),
    contactNumber:     '9645678901',
    safetyScore:       92,
    status:            'AVAILABLE',
  },
];

async function main() {
  // ── 1. Seed roles ────────────────────────────────────────────────────────────
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('✅  Roles seeded:', ROLES.join(', '));

  // ── 2. Seed demo users ───────────────────────────────────────────────────────
  for (const u of USERS) {
    const role         = await prisma.role.findUnique({ where: { name: u.role } });
    const passwordHash = await bcrypt.hash(u.password, SALT_ROUNDS);
    await prisma.user.upsert({
      where:  { email: u.email },
      update: { name: u.name, passwordHash, roleId: role.id },
      create: { name: u.name, email: u.email, passwordHash, roleId: role.id },
    });
    console.log(`✅  User seeded: ${u.email} (${u.role})`);
  }

  // ── 3. Seed vehicles ─────────────────────────────────────────────────────────
  for (const v of VEHICLES) {
    await prisma.vehicle.upsert({
      where:  { registrationNumber: v.registrationNumber },
      update: { name: v.name, model: v.model, type: v.type, region: v.region,
                maxLoadCapacity: v.maxLoadCapacity, acquisitionCost: v.acquisitionCost,
                odometer: v.odometer },
      create: v,
    });
    console.log(`✅  Vehicle seeded: ${v.registrationNumber} — ${v.name}`);
  }

  // ── 4. Seed drivers ──────────────────────────────────────────────────────────
  for (const d of DRIVERS) {
    await prisma.driver.upsert({
      where:  { licenseNumber: d.licenseNumber },
      update: { name: d.name, licenseCategory: d.licenseCategory,
                licenseExpiryDate: d.licenseExpiryDate, contactNumber: d.contactNumber,
                safetyScore: d.safetyScore },
      create: d,
    });
    console.log(`✅  Driver seeded: ${d.name} (${d.licenseNumber})`);
  }

  // ── 5. Seed sample trips (idempotent via source+destination+vehicleId check) ─
  const vehicle1 = await prisma.vehicle.findUnique({ where: { registrationNumber: 'GJ01AB1001' } });
  const driver1  = await prisma.driver.findUnique({ where: { licenseNumber: 'DL0120230001234' } });

  if (vehicle1 && driver1) {
    const existingTrip = await prisma.trip.findFirst({
      where: { vehicleId: vehicle1.id, driverId: driver1.id, source: 'Ahmedabad', destination: 'Mumbai' },
    });
    if (!existingTrip) {
      await prisma.trip.create({
        data: {
          source:          'Ahmedabad',
          destination:     'Mumbai',
          cargoWeight:     18000,
          plannedDistance: 530,
          actualDistance:  535,
          revenue:         45000,
          status:          'COMPLETED',
          vehicleId:       vehicle1.id,
          driverId:        driver1.id,
          dispatchedAt:    new Date('2024-09-10T06:00:00Z'),
          completedAt:     new Date('2024-09-10T16:30:00Z'),
        },
      });
      console.log('✅  Sample trip seeded: Ahmedabad → Mumbai');
    }
  }

  // ── 6. Seed sample maintenance record ────────────────────────────────────────
  const vehicle2 = await prisma.vehicle.findUnique({ where: { registrationNumber: 'GJ05CD2205' } });
  if (vehicle2) {
    const existingMaint = await prisma.maintenance.findFirst({
      where: { vehicleId: vehicle2.id, maintenanceType: 'Oil Change' },
    });
    if (!existingMaint) {
      await prisma.maintenance.create({
        data: {
          maintenanceType: 'Oil Change',
          description:     'Routine 10,000 km service — engine oil and filter replacement',
          startDate:       new Date('2024-09-05'),
          endDate:         new Date('2024-09-05'),
          cost:            3500,
          status:          'COMPLETED',
          notes:           'Completed at Surat service centre. Next due at 72,100 km.',
          vehicleId:       vehicle2.id,
        },
      });
      console.log('✅  Sample maintenance seeded: GJ05CD2205 — Oil Change');
    }
  }

  // ── 7. Seed sample fuel log ───────────────────────────────────────────────────
  if (vehicle1 && driver1) {
    const existingFuel = await prisma.fuelLog.findFirst({ where: { vehicleId: vehicle1.id } });
    if (!existingFuel) {
      await prisma.fuelLog.create({
        data: {
          liters:    120,
          cost:      10800,   // INR — ₹90/litre
          logDate:   new Date('2024-09-10'),
          odometer:  48200,
          vehicleId: vehicle1.id,
        },
      });
      console.log('✅  Sample fuel log seeded: GJ01AB1001');
    }
  }
}

main()
  .catch((err) => {
    console.error('❌  Seed failed:', err.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
