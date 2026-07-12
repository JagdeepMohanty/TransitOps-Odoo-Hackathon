import { verifyJWT } from '../utils/jwt.js';
import { userExists } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const authenticate = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Authentication required');
    }

    const token = header.slice(7);
    let payload;
    try {
      payload = verifyJWT(token);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError' ? 'Session expired, please log in again' : 'Invalid token';
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, message);
    }

    // Confirm the user still exists in the database
    const exists = await userExists(payload.userId);
    if (!exists) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
    }

    req.user = payload; // { userId, email, role }
    next();
  } catch (err) {
    next(err);
  }
};
