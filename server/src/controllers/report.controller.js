const reportService = require('../services/report.service');
const { asyncHandler } = require('../utils/asyncHandler');
const { ApiResponse } = require('../utils/ApiResponse');
const { HTTP_STATUS } = require('../constants/httpStatus');

const getReports = asyncHandler(async (req, res) => {
  const result = await reportService.getReports(req.query);
  res.status(HTTP_STATUS.OK).json(new ApiResponse(HTTP_STATUS.OK, 'Reports fetched.', result));
});

const exportReportsCsv = asyncHandler(async (req, res) => {
  const csv = await reportService.exportReportsCsv(req.query);
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="transitops-report.csv"');
  res.status(HTTP_STATUS.OK).send(csv);
});

module.exports = { getReports, exportReportsCsv };
