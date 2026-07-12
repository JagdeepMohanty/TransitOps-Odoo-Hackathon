import * as driverRepo from '../repositories/driver.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/messages.js';
<<<<<<< Updated upstream
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { getPagination, paginatedResponse } from '../utils/pagination.js';
=======
import { DRIVER_STATUS } from '../constants/statuses.js';

// ── Helpers ────────────────────────────────────────────────────────────────────

const VALID_SORT_FIELDS = new Set(['name', 'status', 'safetyScore', 'licenseExpiryDate', 'createdAt']);

const parseId = (raw) => {
  const id = parseInt(raw, 10);
  if (isNaN(id) || id < 1) throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid ID parameter');
  return id;
};
>>>>>>> Stashed changes

export const getAllDrivers = async (query) => {
  const { page, limit, skip } = getPagination(query);
<<<<<<< Updated upstream
  const filters = {};
  if (query.status) filters.status = query.status;
=======

  const andConditions = [];

  if (query.status) {
    if (!Object.values(DRIVER_STATUS).includes(query.status)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, `Invalid status value: ${query.status}`);
    }
    andConditions.push({ status: query.status });
  }

  if (query.search) {
    andConditions.push({
      OR: [
        { name:          { contains: query.search } },
        { licenseNumber: { contains: query.search } },
        { contactNumber: { contains: query.search } },
      ],
    });
  }

  const where = andConditions.length > 0 ? { AND: andConditions } : {};

  const sortBy    = VALID_SORT_FIELDS.has(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';
>>>>>>> Stashed changes

  const [drivers, total] = await Promise.all([
    driverRepo.findAll(filters, skip, limit),
    driverRepo.countAll(filters),
  ]);
  return paginatedResponse(drivers, total, page, limit);
};

<<<<<<< Updated upstream
export const getDriverById = async (id) => {
  const driver = await driverRepo.findById(id);
=======
// ── Get one ────────────────────────────────────────────────────────────────────

export const getDriverById = async (rawId) => {
  const id = parseId(rawId);
  const driver = await repo.findById(id);
>>>>>>> Stashed changes
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driver;
};

export const getAvailableDrivers = async () => driverRepo.findAvailable();

export const createDriver = async (data) => {
  const existing = await driverRepo.findByLicense(data.licenseNumber);
  if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  return driverRepo.create(data);
};

<<<<<<< Updated upstream
export const updateDriver = async (id, data) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (data.licenseNumber && data.licenseNumber !== driver.licenseNumber) {
    const existing = await driverRepo.findByLicense(data.licenseNumber);
    if (existing) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  }
  return driverRepo.update(id, data);
};

export const deleteDriver = async (id) => {
  const driver = await driverRepo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);
  return driverRepo.remove(id);
=======
// ── Update ─────────────────────────────────────────────────────────────────────

export const updateDriver = async (rawId, inputData) => {
  const id = parseId(rawId);
  const driver = await repo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (inputData.licenseNumber && inputData.licenseNumber !== driver.licenseNumber) {
    const conflict = await repo.findByLicense(inputData.licenseNumber);
    if (conflict) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_LICENSE_EXISTS);
  }

  // Build update payload — never mutate the input parameter
  const updatePayload = { ...inputData };

  if (inputData.licenseExpiryDate) {
    if (isExpired(inputData.licenseExpiryDate)) {
      throw new ApiError(HTTP_STATUS.BAD_REQUEST, MESSAGES.DRIVER_LICENSE_EXPIRED);
    }
    updatePayload.licenseExpiryDate = new Date(inputData.licenseExpiryDate);
  }

  return repo.update(id, updatePayload);
};

// ── Delete ─────────────────────────────────────────────────────────────────────

export const deleteDriver = async (rawId) => {
  const id = parseId(rawId);
  const driver = await repo.findById(id);
  if (!driver) throw new ApiError(HTTP_STATUS.NOT_FOUND, MESSAGES.DRIVER_NOT_FOUND);

  if (driver.status === DRIVER_STATUS.ON_TRIP) {
    throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_ON_TRIP);
  }

  const activeTrip = await repo.hasActiveTrip(id);
  if (activeTrip) throw new ApiError(HTTP_STATUS.CONFLICT, MESSAGES.DRIVER_ON_TRIP);

  await repo.remove(id);
>>>>>>> Stashed changes
};
