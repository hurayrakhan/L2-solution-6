import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';
import { TPropertyFilterRequest } from './property.interface.js';

const createPropertyInDB = async (landlordId: string, payload: any) => {
  const property = await prisma.property.create({
    data: {
      ...payload,
      landlordId,
    },
    include: {
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return property;
};

const getAllPropertiesFromDB = async (filters: TPropertyFilterRequest) => {
  const {
    q,
    city,
    area,
    propertyType,
    minRent,
    maxRent,
    isAvailable,
    page = '1',
    limit = '10',
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = filters;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.PropertyWhereInput[] = [{ deletedAt: null }];

  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { address: { contains: q, mode: 'insensitive' } },
        { area: { contains: q, mode: 'insensitive' } },
      ],
    });
  }

  if (city) {
    andConditions.push({ city: { equals: city, mode: 'insensitive' } });
  }

  if (area) {
    andConditions.push({ area: { equals: area, mode: 'insensitive' } });
  }

  if (propertyType) {
    andConditions.push({ propertyType });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable: isAvailable === 'true' });
  }

  if (minRent || maxRent) {
    andConditions.push({
      rentAmount: {
        ...(minRent && { gte: parseFloat(minRent) }),
        ...(maxRent && { lte: parseFloat(maxRent) }),
      },
    });
  }

  const whereConditions: Prisma.PropertyWhereInput = { AND: andConditions };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { [sortBy]: sortOrder },
      include: {
        landlord: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
    }),
    prisma.property.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: properties,
  };
};

const getPropertyByIdFromDB = async (id: string) => {
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
    include: {
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  if (!property) {
    throw new AppError('Property listing not found', 404);
  }

  return property;
};

const updatePropertyInDB = async (id: string, landlordId: string, userRole: string, payload: any) => {
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (userRole !== 'ADMIN' && property.landlordId !== landlordId) {
    throw new AppError('You are not authorized to update this property', 403);
  }

  const updatedProperty = await prisma.property.update({
    where: { id },
    data: payload,
    include: {
      landlord: {
        select: { id: true, name: true, email: true, phone: true },
      },
    },
  });

  return updatedProperty;
};

const deletePropertyFromDB = async (id: string, landlordId: string, userRole: string) => {
  const property = await prisma.property.findFirst({
    where: { id, deletedAt: null },
  });

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (userRole !== 'ADMIN' && property.landlordId !== landlordId) {
    throw new AppError('You are not authorized to delete this property', 403);
  }

  // Soft Delete Implementation
  await prisma.property.update({
    where: { id },
    data: { deletedAt: new Date(), isAvailable: false },
  });

  return { id };
};

export const PropertyService = {
  createPropertyInDB,
  getAllPropertiesFromDB,
  getPropertyByIdFromDB,
  updatePropertyInDB,
  deletePropertyFromDB,
};
