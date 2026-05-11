import bcrypt from 'bcrypt';
import { config } from '../config';

export const hashPassword = async (value: string): Promise<string> => {
  return bcrypt.hash(value, config.bcryptSaltRounds);
};

export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
