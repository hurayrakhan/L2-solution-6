import { Prisma } from '@prisma/client';
import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const createVehicleInDB = async (ownerId: string, payload: any) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { licensePlate: payload.licensePlate },
  });

  if (existingVehicle) {
    throw new AppError('Vehicle with this license plate already exists', 400);
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      ...payload,
      ownerId,
    },
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return vehicle;
};

const getAllVehiclesFromDB = async (query: any) => {
  const { vehicleType, isAvailable, q, page = '1', limit = '10' } = query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);
  const skip = (pageNumber - 1) * limitNumber;

  const andConditions: Prisma.VehicleWhereInput[] = [{ deletedAt: null }];

  if (vehicleType) {
    andConditions.push({ vehicleType });
  }

  if (isAvailable !== undefined) {
    andConditions.push({ isAvailable: isAvailable === 'true' });
  }

  if (q) {
    andConditions.push({
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { licensePlate: { contains: q, mode: 'insensitive' } },
        { driverName: { contains: q, mode: 'insensitive' } },
      ],
    });
  }

  const whereConditions: Prisma.VehicleWhereInput = { AND: andConditions };

  const [vehicles, total] = await Promise.all([
    prisma.vehicle.findMany({
      where: whereConditions,
      skip,
      take: limitNumber,
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, name: true, email: true, phone: true } },
      },
    }),
    prisma.vehicle.count({ where: whereConditions }),
  ]);

  return {
    meta: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPage: Math.ceil(total / limitNumber),
    },
    data: vehicles,
  };
};

const getVehicleByIdFromDB = async (id: string) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  return vehicle;
};

const updateVehicleInDB = async (id: string, ownerId: string, role: string, payload: any) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  if (role !== 'ADMIN' && vehicle.ownerId !== ownerId) {
    throw new AppError('You are not authorized to update this vehicle', 403);
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data: payload,
    include: {
      owner: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return updatedVehicle;
};

const deleteVehicleFromDB = async (id: string, ownerId: string, role: string) => {
  const vehicle = await prisma.vehicle.findFirst({
    where: { id, deletedAt: null },
  });

  if (!vehicle) {
    throw new AppError('Vehicle not found', 404);
  }

  if (role !== 'ADMIN' && vehicle.ownerId !== ownerId) {
    throw new AppError('You are not authorized to delete this vehicle', 403);
  }

  await prisma.vehicle.update({
    where: { id },
    data: { deletedAt: new Date(), isAvailable: false },
  });

  return { id };
};

export const VehicleService = {
  createVehicleInDB,
  getAllVehiclesFromDB,
  getVehicleByIdFromDB,
  updateVehicleInDB,
  deleteVehicleFromDB,
};
