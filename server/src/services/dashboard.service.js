import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const getKpis = async () => {
  throw new ApiError(HTTP_STATUS.NOT_IMPLEMENTED, 'Dashboard KPIs will be implemented in Hour 5.');
};
