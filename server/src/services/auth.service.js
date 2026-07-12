import { ApiError } from '../utils/ApiError.js';
import { comparePassword } from '../utils/password.js';
import { generateJWT } from '../utils/jwt.js';
import { findUserByEmail, findUserById } from '../repositories/user.repository.js';
import { HTTP_STATUS } from '../constants/httpStatus.js';

export const login = async (email, password) => {
  // Load full record including passwordHash
  const user = await findUserByEmail(email);

  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'Invalid email or password');
  }

  const token = generateJWT({
    userId: user.id,
    email: user.email,
    role: user.role?.name ?? null,
  });

  // Return safe user shape — no passwordHash
  const { passwordHash: _omit, ...safeUser } = user;
  return { token, user: safeUser };
};

export const getCurrentUser = async (userId) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new ApiError(HTTP_STATUS.UNAUTHORIZED, 'User no longer exists');
  }
  return user;
};
