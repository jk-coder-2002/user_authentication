import prisma from '../prisma/client';
import { UserStatus } from '../utils/enum';
import type { User } from '@prisma/client';

export const userRepository = {
  findByEmail: async (email: string): Promise<User | null> => {
    console.log('Finding user by email:', email); // Debug log
    return prisma.user.findUnique({ where: { email } });
  },

  createUser: async (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const [user] = await prisma.$transaction([
      prisma.user.create({ data })
    ]);
    return user;
  },

  findInactiveOlderThan: async (minutes: number): Promise<User[]> => {
    const cutoff = new Date(Date.now() - minutes * 60 * 1000);
    return prisma.user.findMany({ where: { status: UserStatus.INACTIVE, createdAt: { lt: cutoff } } });
  },

  activateUsers: async (ids: number[]): Promise<number> => {
    const result = await prisma.user.updateMany({
      where: { id: { in: ids } },
      data: { status: UserStatus.ACTIVE }
    });
    return result.count;
  },

  findAll: async (): Promise<Pick<User, 'id' | 'fullname' | 'email' | 'gender' | 'mobile' | 'status' | 'createdAt'>[]> => {
    return prisma.user.findMany({
      select: {
        id: true,
        fullname: true,
        email: true,
        gender: true,
        mobile: true,
        status: true,
        createdAt: true
      }
    });
  }
};
