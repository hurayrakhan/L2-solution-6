import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User profile not found', 404);
  }

  return user;
};

const updateMyProfileInDB = async (userId: string, payload: { name?: string; phone?: string; avatar?: string }) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const getUserByIdFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      isVerified: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return user;
};

const updateUserRoleInDB = async (id: string, role: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return updatedUser;
};

const deleteUserFromDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new AppError('User not found', 404);
  }

  return await prisma.user.delete({
    where: { id },
  });
};

export const UserService = {
  getMyProfileFromDB,
  updateMyProfileInDB,
  getUserByIdFromDB,
  updateUserRoleInDB,
  deleteUserFromDB,
};

