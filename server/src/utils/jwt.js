import jwt from 'jsonwebtoken';
import env from '../config/env.js';

export const generateJWT = (payload) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

export const verifyJWT = (token) => jwt.verify(token, env.jwtSecret);
