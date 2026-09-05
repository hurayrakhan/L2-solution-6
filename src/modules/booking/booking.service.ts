import { AppError } from '../../utils/app-error.js';
import { prisma } from '../../utils/prisma.js';

const createBookingInDB = async (tenantId: string, payload: any) => {
  const { vehicleId, bookingType, pickupAddress, dropoffAddress, shiftingDate, laborCount, totalAmount } = payload;

  // Use Database Transaction to prevent race conditions / double bookings
  return await prisma.$transaction(async (tx) => {
    const vehicle = await tx.vehicle.findFirst({
      where: { id: vehicleId, deletedAt: null },
    });

    if (!vehicle) {
      throw new AppError('Vehicle not found', 404);
    }

    if (!vehicle.isAvailable) {
      throw new AppError('Vehicle is currently unavailable for booking', 400);
    }

    const booking = await tx.transportBooking.create({
      data: {
        tenantId,
        vehicleId,
        bookingType,
        pickupAddress,
        dropoffAddress,
        shiftingDate: new Date(shiftingDate),
        laborCount,
        totalAmount,
        escrowStatus: 'HELD',
        status: 'PENDING',
      },
      include: {
        vehicle: {
          include: {
            owner: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    // Create Audit Log entry for critical business operation
    await tx.auditLog.create({
      data: {
        userId: tenantId,
        action: 'CREATE_TRANSPORT_BOOKING',
        entity: 'TransportBooking',
        entityId: booking.id,
        details: `Created ${bookingType} booking for vehicle ${vehicle.licensePlate} worth ${totalAmount} BDT`,
      },
    });

    return booking;
  });
};

const getMyBookingsFromDB = async (userId: string, role: string) => {
  if (role === 'PROVIDER') {
    return prisma.transportBooking.findMany({
      where: {
        vehicle: { ownerId: userId },
      },
      include: {
        vehicle: true,
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  return prisma.transportBooking.findMany({
    where: { tenantId: userId },
    include: {
      vehicle: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const getBookingByIdFromDB = async (id: string) => {
  const booking = await prisma.transportBooking.findUnique({
    where: { id },
    include: {
      vehicle: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      tenant: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  return booking;
};

const updateBookingStatusInDB = async (id: string, userId: string, role: string, newStatus: string) => {
  const booking = await prisma.transportBooking.findUnique({
    where: { id },
    include: { vehicle: true },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (role !== 'ADMIN' && booking.vehicle.ownerId !== userId && booking.tenantId !== userId) {
    throw new AppError('You are not authorized to update this booking', 403);
  }

  return await prisma.$transaction(async (tx) => {
    let newEscrowStatus = booking.escrowStatus;
    if (newStatus === 'COMPLETED') {
      newEscrowStatus = 'RELEASED';
    } else if (newStatus === 'CANCELLED') {
      newEscrowStatus = 'REFUNDED';
    }

    const updatedBooking = await tx.transportBooking.update({
      where: { id },
      data: {
        status: newStatus as any,
        escrowStatus: newEscrowStatus as any,
      },
      include: {
        vehicle: true,
        tenant: { select: { id: true, name: true, email: true, phone: true } },
      },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: 'UPDATE_BOOKING_STATUS',
        entity: 'TransportBooking',
        entityId: booking.id,
        details: `Updated booking status from ${booking.status} to ${newStatus}`,
      },
    });

    return updatedBooking;
  });
};

const getAllBookingsFromDB = async () => {
  return prisma.transportBooking.findMany({
    include: {
      vehicle: {
        include: {
          owner: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      tenant: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

const deleteBookingFromDB = async (id: string, userId: string, role: string) => {
  const booking = await prisma.transportBooking.findUnique({
    where: { id },
  });

  if (!booking) {
    throw new AppError('Booking not found', 404);
  }

  if (role !== 'ADMIN' && booking.tenantId !== userId) {
    throw new AppError('You are not authorized to delete/cancel this booking', 403);
  }

  return await prisma.$transaction(async (tx) => {
    const deletedBooking = await tx.transportBooking.delete({
      where: { id },
    });

    await tx.auditLog.create({
      data: {
        userId,
        action: 'DELETE_BOOKING',
        entity: 'TransportBooking',
        entityId: id,
        details: `Deleted booking ${id}`,
      },
    });

    return deletedBooking;
  });
};

export const BookingService = {
  createBookingInDB,
  getMyBookingsFromDB,
  getAllBookingsFromDB,
  getBookingByIdFromDB,
  updateBookingStatusInDB,
  deleteBookingFromDB,
};

