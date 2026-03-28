import { userRepository } from './user.repository';
import { ProfileUser } from './user.types';



export const getUserProfile = async (userId: string): Promise<ProfileUser> => {
  const user = await userRepository.findProfileById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserProfile = async (userId: string, data: { email?: string }): Promise<ProfileUser> => {
  const user = await userRepository.updateProfile(userId, data);

  if (!user) {
    throw new Error('User update failed');
  }

  return user;
};
