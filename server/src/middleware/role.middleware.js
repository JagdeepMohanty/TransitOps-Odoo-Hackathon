import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

/**
 * authorize(...roles)
 * Usage: authorize('FLEET_MANAGER')
 *        authorize('DISPATCHER', 'FLEET_MANAGER')
 *
 * Requires authenticate() to have run first (req.user must be set).
 */
export const authorize = (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required'));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(HTTP_STATUS.FORBIDDEN, 'You do not have permission to perform this action'));
    }
    next();
  };
