import * as maintenanceService from '../services/maintenance.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getMaintenance = asyncHandler(async (req, res) => {
  const result = await maintenanceService.getAllMaintenance(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Maintenance logs fetched.', result).send(res);
});

export const getMaintenanceById = asyncHandler(async (req, res) => {
  const log = await maintenanceService.getMaintenanceById(parseInt(req.params.id));
  return new ApiResponse(HTTP_STATUS.OK, 'Maintenance log fetched.', log).send(res);
});

export const createMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.createMaintenance(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.MAINTENANCE_CREATED, log).send(res);
});

export const updateMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.updateMaintenance(parseInt(req.params.id), req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.MAINTENANCE_UPDATED, log).send(res);
});

export const closeMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.closeMaintenance(parseInt(req.params.id), req.body);
  return new ApiResponse(HTTP_STATUS.OK, MESSAGES.MAINTENANCE_CLOSED, log).send(res);
});
