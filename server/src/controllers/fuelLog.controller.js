const fuelLogService = require('../services/fuelLog.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');
const { MESSAGES } = require('../constants/messages');

const getFuelLogs = asyncHandler(async (req, res) => {
  const result = await fuelLogService.getAllFuelLogs(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Fuel logs fetched.', result));
});

const createFuelLog = asyncHandler(async (req, res) => {
  const log = await fuelLogService.createFuelLog(req.body);
  res.status(HTTP_STATUS.CREATED).json(new ApiResponse(HTTP_STATUS.CREATED, MESSAGES.FUEL_LOG_CREATED, log));
});

module.exports = { getFuelLogs, createFuelLog };
