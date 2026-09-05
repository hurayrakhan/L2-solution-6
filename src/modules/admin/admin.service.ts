import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const getDashboardStatsFromDB = async () => {
  const [totalUsers, totalProperties, totalVehicles, totalBookings, successfulPayments] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.property.count({ where: { deletedAt: null } }),
    prisma.vehicle.count({ where: { deletedAt: null } }),
    prisma.transportBooking.count(),
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true },
      _count: true,
    }),
  ]);

  return {
    totalUsers,
    totalProperties,
    totalVehicles,
    totalBookings,
    totalRevenue: successfulPayments._sum.amount || 0,
    successfulPaymentsCount: successfulPayments._count || 0,
  };
};

const getAllUsersFromDB = async (query: any) => {
  const { role, page = '1', limit = '10' } = query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const whereConditions: any = { deletedAt: null };
  if (role) {
    whereConditions.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
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
    }),
    prisma.user.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: users,
  };
};

const verifyProviderInDB = async (providerId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: providerId },
  });

  if (!user || user.deletedAt) {
    throw new AppError('Provider user not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: providerId },
    data: { isVerified: true },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: providerId,
      action: 'ADMIN_VERIFY_PROVIDER',
      entity: 'User',
      entityId: providerId,
      details: `Admin verified provider ${user.email}`,
    },
  });

  return updatedUser;
};

const getAuditLogsFromDB = async (query: any) => {
  const { page = '1', limit = '10' } = query;
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true, role: true } },
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: logs,
  };
};

export const AdminService = {
  getDashboardStatsFromDB,
  getAllUsersFromDB,
  verifyProviderInDB,
  getAuditLogsFromDB,
};
