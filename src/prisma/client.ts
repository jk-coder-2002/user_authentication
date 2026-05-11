import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectToDatabase = async (): Promise<void> => {
  await prisma.$connect();
};

export default prisma;
