const maintenanceService = require('../services/maintenance.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getMaintenance = asyncHandler(async (req, res) => {
  const result = await maintenanceService.getAllMaintenance(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Maintenance logs fetched.', result));
});

const getMaintenanceById = asyncHandler(async (req, res) => {
  const log = await maintenanceService.getMaintenanceById(parseInt(req.params.id));
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Maintenance log fetched.', log));
});

const createMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.createMaintenance(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.MAINTENANCE_CREATED, log));
});

const updateMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.updateMaintenance(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.MAINTENANCE_UPDATED, log));
});

const closeMaintenance = asyncHandler(async (req, res) => {
  const log = await maintenanceService.closeMaintenance(parseInt(req.params.id), req.body);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, MESSAGES.MAINTENANCE_CLOSED, log));
});

module.exports = { getMaintenance, getMaintenanceById, createMaintenance, updateMaintenance, closeMaintenance };
