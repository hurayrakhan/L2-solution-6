import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const createUtilityBillInDB = async (landlordId: string, payload: any) => {
  const { propertyId, month, year, electricityBill, gasBill, waterBill, maidSalary, tenantCount } = payload;

  const property = await prisma.property.findFirst({
    where: { id: propertyId, deletedAt: null },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (property.landlordId !== landlordId) {
    throw new AppError('You are not authorized to manage utilities for this property', 403);
  }

  const totalAmount = electricityBill + gasBill + waterBill + maidSalary;
  const perTenantShare = parseFloat((totalAmount / tenantCount).toFixed(2));

  const utilityBill = await prisma.utilityBill.create({
    data: {
      propertyId,
      landlordId,
      month,
      year,
      electricityBill,
      gasBill,
      waterBill,
      maidSalary,
      totalAmount,
      perTenantShare,
      status: 'UNPAID',
    },
    include: {
      property: { select: { id: true, title: true, address: true } },
    },
  });

  return utilityBill;
};

const getMyUtilityBillsFromDB = async (userId: string, role: string) => {
  if (role === 'PROVIDER') {
    return prisma.utilityBill.findMany({
      where: { landlordId: userId },
      include: {
        property: { select: { id: true, title: true, address: true } },
        utilityPayments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.utilityBill.findMany({
    include: {
      property: { select: { id: true, title: true, address: true } },
      utilityPayments: {
        where: { tenantId: userId },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getUtilityBillByIdFromDB = async (id: string) => {
  const bill = await prisma.utilityBill.findUnique({
    where: { id },
    include: {
      property: true,
      utilityPayments: {
        include: {
          tenant: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
  });

  if (!bill) {
    throw new AppError('Utility bill not found', 404);
  }

  return bill;
};

export const UtilityService = {
  createUtilityBillInDB,
  getMyUtilityBillsFromDB,
  getUtilityBillByIdFromDB,
};
