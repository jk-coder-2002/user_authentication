import { userRepository } from '../repositories/user.repository';

export const userService = {
  getAllUsers: async () => {
    return userRepository.findAll();
  }
};
