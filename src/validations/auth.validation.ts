import type { Request } from 'express';

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const validateSignup = (req: Request): string[] => {
  const { fullname, email, password, confirmPassword, gender, mobile } = req.body as Record<string, unknown>;
  const errors: string[] = [];

  if (!fullname || typeof fullname !== 'string' || !fullname.trim()) {
    errors.push('fullname is required');
  }

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('valid email is required');
  }

  if (!password || typeof password !== 'string' || !passwordPattern.test(password)) {
    errors.push('Password must follow Minimum 8 characters, 1 uppercase, 1 lowercase, 1 special character, and 1 number');
  }

  if (!confirmPassword || typeof confirmPassword !== 'string' || password !== confirmPassword) {
    errors.push('confirmPassword does not match with password');
  }

  if (!gender || typeof gender !== 'string' || !gender.trim()) {
    errors.push('gender is required');
  }

  if (!mobile || typeof mobile !== 'string' || mobile.trim().length < 7) {
    errors.push('mobile is required');
  }

  return errors;
};

export const validateLogin = (req: Request): string[] => {
  const { email, password } = req.body as Record<string, unknown>;
  const errors: string[] = [];

  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    errors.push('valid email is required');
  }

  if (!password || typeof password !== 'string') {
    errors.push('password is required');
  }

  return errors;
};
