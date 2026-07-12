import * as reportService from '../services/report.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getReports = asyncHandler(async (req, res) => {
  const result = await reportService.getReports(req.query);
  return new ApiResponse(HTTP_STATUS.OK, 'Reports fetched.', result).send(res);
});

export const exportReportsCsv = asyncHandler(async (req, res) => {
  const csv = await reportService.exportReportsCsv(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transitops-report.csv"');
  res.status(HTTP_STATUS.OK).send(csv);
});
