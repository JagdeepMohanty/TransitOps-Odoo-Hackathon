import * as vehicleRepo from '../repositories/vehicle.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
<<<<<<< Updated upstream
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
=======
import { VEHICLE_STATUS } from '../constants/statuses.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

const VALID_SORT_FIELDS = new Set(['name', 'status', 'type', 'region', 'createdAt', 'odometer']);

const parseId = (raw) => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID parameter');
  return id;
};
>>>>>>> Stashed changes

export const getAllVehicles = async (query) => {
  const { page, limit, skip } = getPagination(query);
<<<<<<< Updated upstream
  const filters = {};
  if (query.status) filters.status = query.status;
  if (query.type) filters.type = query.type;
  if (query.region) filters.region = query.region;
=======

  // Build filter conditions — each goes into AND so they combine correctly
  const andConditions = [];

  if (query.status) {
    if (!Object.values(VEHICLE_STATUS).includes(query.status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status value: ${query.status}`);
    }
    andConditions.push({ status: query.status });
  }

  if (query.type)   andConditions.push({ type:   { contains: query.type } });
  if (query.region) andConditions.push({ region: { contains: query.region } });

  // Search across multiple fields — wrapped in OR, combined with AND filters above
  if (query.search) {
    andConditions.push({
      OR: [
        { name:               { contains: query.search } },
        { registrationNumber: { contains: query.search } },
        { type:               { contains: query.search } },
        { region:             { contains: query.search } },
      ],
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const sortBy    = VALID_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
>>>>>>> Stashed changes

  const [vehicles, total] = await Promise.all([
    vehicleRepo.findAll(filters, skip, limit),
    vehicleRepo.countAll(filters),
  ]);
  return paginatedResponse(vehicles, total, page, limit);
};

<<<<<<< Updated upstream
export const getVehicleById = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
=======
// ── Get one ────────────────────────────────────────────────────────────────────

export const getVehicleById = async (rawId) => {
  const id = parseId(rawId);
  const vehicle = await repo.findById(id);
>>>>>>> Stashed changes
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicle;
};

export const getAvailableVehicles = async () => vehicleRepo.findAvailable();

export const createVehicle = async (data) => {
  const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  return vehicleRepo.create(data);
};

<<<<<<< Updated upstream
export const updateVehicle = async (id, data) => {
  const vehicle = await vehicleRepo.findById(id);
=======
// ── Update ─────────────────────────────────────────────────────────────────────

export const updateVehicle = async (rawId, data) => {
  const id = parseId(rawId);
  const vehicle = await repo.findById(id);
>>>>>>> Stashed changes
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  if (data.registrationNumber && data.registrationNumber !== vehicle.registrationNumber) {
    const existing = await vehicleRepo.findByRegistration(data.registrationNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_REG_EXISTS);
  }
  return vehicleRepo.update(id, data);
};

<<<<<<< Updated upstream
export const deleteVehicle = async (id) => {
  const vehicle = await vehicleRepo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);
  return vehicleRepo.remove(id);
=======
// ── Delete ─────────────────────────────────────────────────────────────────────

export const deleteVehicle = async (rawId) => {
  const id = parseId(rawId);
  const vehicle = await repo.findById(id);
  if (!vehicle) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.VEHICLE_NOT_FOUND);

  // Fast-fail on current status before hitting the DB again
  if (vehicle.status === VEHICLE_STATUS.ON_TRIP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ON_TRIP);
  }
  if (vehicle.status === VEHICLE_STATUS.IN_SHOP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_IN_SHOP);
  }

  // Parallel safety checks — a vehicle could be AVAILABLE but still have a DRAFT trip
  const [activeTrip, activeMaintenance] = await Promise.all([
    repo.hasActiveTrip(id),
    repo.hasActiveMaintenance(id),
  ]);

  if (activeTrip)        throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_ON_TRIP);
  if (activeMaintenance) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.VEHICLE_IN_SHOP);

  await repo.remove(id);
>>>>>>> Stashed changes
};
