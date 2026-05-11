import prisma from '../prisma/client';
import { UserStatus } from '../utils/enum';
import type { User } from '@prisma/client';

type UserFilters = {
    status?: string;
    gender?: string;
};

type UserSort = {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
};

type UserPagination = {
    page?: number;
    limit?: number;
};

type UserSearch = {
    q?: string;
};

type UserQuery = UserFilters & UserSort & UserPagination & UserSearch;

type PaginatedUsers = {
    users: Pick<User, 'id' | 'fullname' | 'email' | 'gender' | 'mobile' | 'status' | 'createdAt'>[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

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

    findAll: async (query: UserQuery): Promise<PaginatedUsers> => {
        const { q, status, gender, sortBy, sortOrder, page = 1, limit = 10 } = query;

        const where: any = {};

        if (status) {
            where.status = status;
        }

        if (gender) {
            where.gender = gender;
        }

        if (q) {
            where.OR = [
                { fullname: { contains: q, mode: 'insensitive' } },
                { email: { contains: q, mode: 'insensitive' } },
                { mobile: { contains: q } }
            ];
        }

        const orderBy: any = {};
        if (sortBy) {
            orderBy[sortBy] = sortOrder || 'asc';
        } else {
            orderBy.createdAt = 'desc';
        }

        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                select: {
                    id: true,
                    fullname: true,
                    email: true,
                    gender: true,
                    mobile: true,
                    status: true,
                    createdAt: true
                },
                orderBy,
                skip,
                take: limit
            }),
            prisma.user.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            pagination: {
                page,
                limit,
                total,
                totalPages
            },
            users
        };
    }
};
