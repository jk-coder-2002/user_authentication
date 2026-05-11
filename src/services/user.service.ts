import { userRepository } from '../repositories/user.repository';

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
  users: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export const userService = {
  getAllUsers: async (query: UserQuery): Promise<PaginatedUsers> => {
    return userRepository.findAll(query);
  }
};
