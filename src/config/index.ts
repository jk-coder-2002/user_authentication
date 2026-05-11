import dotenv from 'dotenv';

dotenv.config();

const getEnv = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const config = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: getEnv('DATABASE_URL'),
  jwtSecret: getEnv('JWT_SECRET'),
  jwtExpiresIn: getEnv('JWT_EXPIRES_IN', '1h'),
  bcryptSaltRounds: Number(getEnv('BCRYPT_SALT_ROUNDS', '10')),
  smtpHost: getEnv('SMTP_HOST', 'smtp.gmail.com'),
  smtpPort: Number(getEnv('SMTP_PORT', '587')),
  smtpUser: getEnv('SMTP_USER'),
  smtpPass: getEnv('SMTP_PASS')
};
