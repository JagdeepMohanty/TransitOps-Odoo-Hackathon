/**
 * Trip Module Integration Tests
 *
 * Runner : node --test tests/trips.test.js
 * Requires a running MySQL instance with DATABASE_URL set in server/.env
 *
 * Test order matters — each test builds on the state left by the previous one.
 * A fresh DB seed is expected before running (npm run prisma:seed).
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ── Helpers ────────────────────────────────────────────────────────────────────

const BASE = 'http://localhost:5000/api';

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  const res  = await fetch(`${BASE}${path}`, opts);
  const json = await res.json();
  return { status: res.status, body: json };
}

// ── Shared state ───────────────────────────────────────────────────────────────

let token;
let vehicleId;
let driverId;
let tripId;

// ── Setup ──────────────────────────────────────────────────────────────────────

before(async () => {
  // Clean up any leftover test data
  await prisma.trip.deleteMany({ where: { source: 'TEST_SRC' } });
  await prisma.vehicle.deleteMany({ where: { registrationNumber: 'TEST-001' } });
  await prisma.driver.deleteMany({ where: { licenseNumber: 'TEST-LIC-001' } });

  // Ensure fleet manager user exists
  const role = await prisma.role.findUnique({ where: { name: 'FLEET_MANAGER' } });
  assert.ok(role, 'FLEET_MANAGER role must exist — run prisma:seed first');

  // Login
  const loginRes = await req('POST', '/auth/login', {
    email: 'fleet@transitops.com',
    password: 'Fleet@123',
  });
  assert.equal(loginRes.status, 200, 'Login must succeed');
  token = loginRes.body.data.token;

  // Create test vehicle
  const vRes = await req('POST', '/vehicles', {
    registrationNumber: 'TEST-001',
    name: 'Test Truck',
    type: 'Truck',
    maxLoadCapacity: 10000,
    acquisitionCost: 500000,
    odometer: 5000,
  }, token);
  assert.equal(vRes.status, 201, `Vehicle create failed: ${JSON.stringify(vRes.body)}`);
  vehicleId = vRes.body.data.id;

  // Create test driver with valid future license
  const futureDate = new Date();
  futureDate.setFullYear(futureDate.getFullYear() + 3);

  const dRes = await req('POST', '/drivers', {
    name: 'Test Driver',
    licenseNumber: 'TEST-LIC-001',
    licenseCategory: 'HGV',
    licenseExpiryDate: futureDate.toISOString().split('T')[0],
    contactNumber: '9999999999',
    safetyScore: 90,
  }, token);
  assert.equal(dRes.status, 201, `Driver create failed: ${JSON.stringify(dRes.body)}`);
  driverId = dRes.body.data.id;
});

after(async () => {
  // Cleanup in dependency order
  await prisma.trip.deleteMany({ where: { source: 'TEST_SRC' } });
  await prisma.vehicle.deleteMany({ where: { registrationNumber: 'TEST-001' } });
  await prisma.driver.deleteMany({ where: { licenseNumber: 'TEST-LIC-001' } });
  await prisma.$disconnect();
});

// ── Tests ──────────────────────────────────────────────────────────────────────

describe('Trip Module', () => {

  describe('POST /trips — Create Trip', () => {

    it('creates a DRAFT trip with valid vehicle and driver', async () => {
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'TEST_DST',
        vehicleId,
        driverId,
        cargoWeight:     5000,
        plannedDistance: 300,
      }, token);

      assert.equal(res.status, 201);
      assert.equal(res.body.data.status, 'DRAFT');
      assert.equal(res.body.data.vehicleId, vehicleId);
      assert.equal(res.body.data.driverId, driverId);
      assert.ok(res.body.data.id);
      tripId = res.body.data.id;
    });

    it('rejects cargo weight exceeding vehicle capacity', async () => {
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'TEST_DST',
        vehicleId,
        driverId,
        cargoWeight:     99999,   // exceeds 10000 capacity
        plannedDistance: 300,
      }, token);

      assert.equal(res.status, 409);
      assert.match(res.body.message, /cargo/i);
    });

    it('rejects non-existent vehicle', async () => {
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'TEST_DST',
        vehicleId:       999999,
        driverId,
        cargoWeight:     100,
        plannedDistance: 100,
      }, token);

      assert.equal(res.status, 404);
      assert.match(res.body.message, /vehicle not found/i);
    });

    it('rejects non-existent driver', async () => {
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'TEST_DST',
        vehicleId,
        driverId:        999999,
        cargoWeight:     100,
        plannedDistance: 100,
      }, token);

      assert.equal(res.status, 404);
      assert.match(res.body.message, /driver not found/i);
    });

    it('rejects missing required fields', async () => {
      const res = await req('POST', '/trips', {
        source: 'TEST_SRC',
        // missing destination, vehicleId, driverId, cargoWeight, plannedDistance
      }, token);

      assert.equal(res.status, 400);
      assert.equal(res.body.success, false);
    });

    it('rejects driver with expired license', async () => {
      // Create a driver with an expired license
      const expiredDate = new Date();
      expiredDate.setFullYear(expiredDate.getFullYear() - 1);

      const dRes = await req('POST', '/drivers', {
        name:              'Expired Driver',
        licenseNumber:     'TEST-LIC-EXPIRED',
        licenseCategory:   'HGV',
        licenseExpiryDate: expiredDate.toISOString().split('T')[0],
        contactNumber:     '8888888888',
      }, token);

      // Expired license should be rejected at create time
      assert.equal(dRes.status, 400);
      assert.match(dRes.body.message, /expired/i);
    });

  });

  describe('GET /trips — List Trips', () => {

    it('returns paginated list', async () => {
      const res = await req('GET', '/trips?page=1&limit=5', null, token);
      assert.equal(res.status, 200);
      assert.ok(Array.isArray(res.body.data.data));
      assert.ok(res.body.data.pagination);
      assert.ok(typeof res.body.data.pagination.total === 'number');
    });

    it('filters by status=DRAFT', async () => {
      const res = await req('GET', '/trips?status=DRAFT', null, token);
      assert.equal(res.status, 200);
      res.body.data.data.forEach((t) => assert.equal(t.status, 'DRAFT'));
    });

    it('filters by vehicleId', async () => {
      const res = await req('GET', `/trips?vehicleId=${vehicleId}`, null, token);
      assert.equal(res.status, 200);
      res.body.data.data.forEach((t) => assert.equal(t.vehicleId, vehicleId));
    });

    it('searches by source', async () => {
      const res = await req('GET', '/trips?search=TEST_SRC', null, token);
      assert.equal(res.status, 200);
      assert.ok(res.body.data.data.length > 0);
    });

    it('rejects invalid status filter', async () => {
      const res = await req('GET', '/trips?status=INVALID_STATUS', null, token);
      assert.equal(res.status, 400);
    });

  });

  describe('GET /trips/:id — Get Trip', () => {

    it('returns the trip by id', async () => {
      const res = await req('GET', `/trips/${tripId}`, null, token);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.id, tripId);
      assert.ok(res.body.data.vehicle);
      assert.ok(res.body.data.driver);
    });

    it('returns 404 for unknown id', async () => {
      const res = await req('GET', '/trips/999999', null, token);
      assert.equal(res.status, 404);
    });

    it('returns 400 for non-integer id', async () => {
      const res = await req('GET', '/trips/abc', null, token);
      assert.equal(res.status, 400);
    });

  });

  describe('PUT /trips/:id — Update Trip (DRAFT only)', () => {

    it('updates source and destination on a DRAFT trip', async () => {
      const res = await req('PUT', `/trips/${tripId}`, {
        source:      'TEST_SRC',
        destination: 'UPDATED_DST',
      }, token);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.destination, 'UPDATED_DST');
    });

  });

  describe('POST /trips/:id/dispatch — Dispatch Trip', () => {

    it('dispatches a DRAFT trip and sets vehicle/driver ON_TRIP', async () => {
      const res = await req('POST', `/trips/${tripId}/dispatch`, null, token);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'DISPATCHED');
      assert.ok(res.body.data.dispatchedAt);
      assert.ok(res.body.data.startOdometer !== null);
    });

    it('rejects dispatching an already-dispatched trip', async () => {
      const res = await req('POST', `/trips/${tripId}/dispatch`, null, token);
      assert.equal(res.status, 409);
      assert.match(res.body.message, /invalid trip status/i);
    });

    it('rejects creating a new trip with the same vehicle (now ON_TRIP)', async () => {
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'TEST_DST2',
        vehicleId,
        driverId,
        cargoWeight:     100,
        plannedDistance: 100,
      }, token);

      assert.equal(res.status, 409);
      assert.match(res.body.message, /not available/i);
    });

    it('rejects updating a dispatched trip', async () => {
      const res = await req('PUT', `/trips/${tripId}`, { source: 'CHANGED' }, token);
      assert.equal(res.status, 409);
    });

  });

  describe('POST /trips/:id/complete — Complete Trip', () => {

    it('rejects completion with finalOdometer less than startOdometer', async () => {
      const tripRes = await req('GET', `/trips/${tripId}`, null, token);
      const startOdo = Number(tripRes.body.data.startOdometer);

      const res = await req('POST', `/trips/${tripId}/complete`, {
        actualDistance: 200,
        fuelConsumed:   30,
        finalOdometer:  startOdo - 1,   // invalid — less than start
      }, token);

      assert.equal(res.status, 400);
      assert.match(res.body.message, /odometer/i);
    });

    it('completes a dispatched trip and restores vehicle/driver to AVAILABLE', async () => {
      const tripRes = await req('GET', `/trips/${tripId}`, null, token);
      const startOdo = Number(tripRes.body.data.startOdometer);

      const res = await req('POST', `/trips/${tripId}/complete`, {
        actualDistance: 280,
        fuelConsumed:   42,
        finalOdometer:  startOdo + 280,
        revenue:        15000,
      }, token);

      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'COMPLETED');
      assert.ok(res.body.data.completedAt);
      assert.equal(Number(res.body.data.actualDistance), 280);
      assert.equal(Number(res.body.data.fuelConsumed), 42);
    });

    it('rejects completing an already-completed trip', async () => {
      const res = await req('POST', `/trips/${tripId}/complete`, {
        actualDistance: 100,
        fuelConsumed:   20,
        finalOdometer:  9999,
      }, token);

      assert.equal(res.status, 409);
    });

  });

  describe('POST /trips/:id/cancel — Cancel Trip', () => {

    let cancelTripId;

    before(async () => {
      // Create a fresh DRAFT trip to cancel
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'CANCEL_DST',
        vehicleId,
        driverId,
        cargoWeight:     100,
        plannedDistance: 50,
      }, token);
      assert.equal(res.status, 201);
      cancelTripId = res.body.data.id;
    });

    it('cancels a DRAFT trip', async () => {
      const res = await req('POST', `/trips/${cancelTripId}/cancel`, null, token);
      assert.equal(res.status, 200);
      assert.equal(res.body.data.status, 'CANCELLED');
      assert.ok(res.body.data.cancelledAt);
    });

    it('rejects cancelling an already-cancelled trip', async () => {
      const res = await req('POST', `/trips/${cancelTripId}/cancel`, null, token);
      assert.equal(res.status, 409);
    });

    it('rejects cancelling a completed trip', async () => {
      const res = await req('POST', `/trips/${tripId}/cancel`, null, token);
      assert.equal(res.status, 409);
    });

  });

  describe('DELETE /trips/:id — Delete Trip', () => {

    let deleteTripId;

    before(async () => {
      // Create a DRAFT trip to delete
      const res = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'DELETE_DST',
        vehicleId,
        driverId,
        cargoWeight:     100,
        plannedDistance: 50,
      }, token);
      assert.equal(res.status, 201);
      deleteTripId = res.body.data.id;
    });

    it('deletes a DRAFT trip', async () => {
      const res = await req('DELETE', `/trips/${deleteTripId}`, null, token);
      assert.equal(res.status, 200);
    });

    it('returns 404 after deletion', async () => {
      const res = await req('GET', `/trips/${deleteTripId}`, null, token);
      assert.equal(res.status, 404);
    });

    it('rejects deleting a DISPATCHED trip', async () => {
      // Create and dispatch a trip
      const createRes = await req('POST', '/trips', {
        source:          'TEST_SRC',
        destination:     'NODELETE_DST',
        vehicleId,
        driverId,
        cargoWeight:     100,
        plannedDistance: 50,
      }, token);
      const newId = createRes.body.data.id;

      await req('POST', `/trips/${newId}/dispatch`, null, token);

      const delRes = await req('DELETE', `/trips/${newId}`, null, token);
      assert.equal(delRes.status, 409);

      // Cleanup — cancel it so vehicle/driver are freed
      await req('POST', `/trips/${newId}/cancel`, null, token);
    });

  });

});
