import prisma from '../utils/prisma';

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });
  return users;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export const updateUserRole = async (id: string, role: any) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updatedUser;
};

export const toggleUserStatus = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error('User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: { isActive: !user.isActive },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
    },
  });

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new Error('User not found');
  }

  await prisma.user.delete({ where: { id } });

  return { message: 'User deleted successfully' };
};