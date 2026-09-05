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

const getAllUtilityBillsFromDB = async () => {
  return prisma.utilityBill.findMany({
    include: {
      property: { select: { id: true, title: true, address: true } },
      utilityPayments: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const updateUtilityBillInDB = async (id: string, landlordId: string, role: string, payload: any) => {
  const bill = await prisma.utilityBill.findUnique({ where: { id } });
  if (!bill) {
    throw new AppError('Utility bill not found', 404);
  }
  if (role !== 'ADMIN' && bill.landlordId !== landlordId) {
    throw new AppError('You are not authorized to update this bill', 403);
  }

  const updatedBill = await prisma.utilityBill.update({
    where: { id },
    data: payload,
    include: { property: { select: { id: true, title: true, address: true } } },
  });

  return updatedBill;
};

const payUtilityShareInDB = async (billId: string, tenantId: string) => {
  const bill = await prisma.utilityBill.findUnique({ where: { id: billId } });
  if (!bill) {
    throw new AppError('Utility bill not found', 404);
  }

  const payment = await prisma.utilityPayment.create({
    data: {
      utilityBillId: billId,
      tenantId,
      amount: bill.perTenantShare,
      paymentStatus: 'SUCCESS',
      paidAt: new Date(),
    },
  });

  return payment;
};


const deleteUtilityBillFromDB = async (id: string, landlordId: string, role: string) => {
  const bill = await prisma.utilityBill.findUnique({ where: { id } });
  if (!bill) {
    throw new AppError('Utility bill not found', 404);
  }
  if (role !== 'ADMIN' && bill.landlordId !== landlordId) {
    throw new AppError('You are not authorized to delete this bill', 403);
  }

  return await prisma.utilityBill.delete({ where: { id } });
};

export const UtilityService = {
  createUtilityBillInDB,
  getAllUtilityBillsFromDB,
  getMyUtilityBillsFromDB,
  getUtilityBillByIdFromDB,
  updateUtilityBillInDB,
  payUtilityShareInDB,
  deleteUtilityBillFromDB,
};

