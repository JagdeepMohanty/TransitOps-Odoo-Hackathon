import * as dashboardService from '../services/dashboard.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getKpis = asyncHandler(async (req, res) => {
  const data = await dashboardService.getKpis(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'KPIs retrieved successfully.', data).send(res);
});
