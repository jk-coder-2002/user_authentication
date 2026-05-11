import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';
import { config } from '../config';

type JwtPayload = {
  userId: number;
};

const jwtSecret: Secret = config.jwtSecret;

export const signJwt = (payload: JwtPayload): string => {
  const options: SignOptions = { expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'] };
  return jwt.sign(payload, jwtSecret, options);
};

export const verifyJwt = (token: string): JwtPayload => {
  return jwt.verify(token, jwtSecret) as JwtPayload;
};
