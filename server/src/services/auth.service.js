import { ApiError } from '../utils/ApiError.js';
import { comparePassword } from '../utils/password.js';
import { generateJWT } from '../utils/jwt.js';
import { findUserByEmail, findUserById } from '../repositories/user.repository.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';
import { MESSAGES } from '../constants/messages.js';

export const login = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.INVALID_CREDENTIALS);

  const token = generateJWT({
    userId: user.id,
    email:  user.email,
    role:   user.role?.name ?? null,
  });

  const { passwordHash: _omit, ...safeUser } = user;
  return { token, user: safeUser };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(HTTP_STATUS.UNAUTHORIZED, MESSAGES.USER_NOT_FOUND);
  return user;
};
