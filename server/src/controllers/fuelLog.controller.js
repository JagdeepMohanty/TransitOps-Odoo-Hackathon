import * as fuelLogService from '../services/fuelLog.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const getFuelLogs = asyncHandler(async (req, res) => {
  const result = await fuelLogService.getAllFuelLogs(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Fuel logs fetched.', result).send(res);
});

export const createFuelLog = asyncHandler(async (req, res) => {
  const log = await fuelLogService.createFuelLog(req.body);
  return new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.FUEL_LOG_CREATED, log).send(res);
});
