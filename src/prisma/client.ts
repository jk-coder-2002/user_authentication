import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export const verifySchema = async (): Promise<void> => {
  await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
};

export default prisma;
