import bcrypt from 'bcryptjs';
import { prisma } from '../src/utils/prisma.js';

async function main() {
  console.log('🌱 Starting MoveInBD database seeding...');

  const hashedPassword = await bcrypt.hash('admin123456', 12);

  // 1. Create Admin Account
  const admin = await prisma.user.upsert({
    where: { email: 'admin@moveinbd.com' },
    update: {},
    create: {
      name: 'System Admin',
      email: 'admin@moveinbd.com',
      password: hashedPassword,
      phone: '+8801700000000',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  // 2. Create Landlord / Provider Account
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@moveinbd.com' },
    update: {},
    create: {
      name: 'Rahim Landlord & Transport',
      email: 'landlord@moveinbd.com',
      password: hashedPassword,
      phone: '+8801811111111',
      role: 'PROVIDER',
      isVerified: true,
    },
  });

  // 3. Create Tenant / User Account
  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@moveinbd.com' },
    update: {},
    create: {
      name: 'Tanvir Ahmed Tenant',
      email: 'tenant@moveinbd.com',
      password: hashedPassword,
      phone: '+8801922222222',
      role: 'TENANT_USER',
      isVerified: true,
    },
  });

  // 4. Create Demo Property Listing
  const property = await prisma.property.create({
    data: {
      landlordId: landlord.id,
      title: 'Modern 3 BHK Flat in Mirpur DOHS',
      description: 'Spacious 3 bedroom flat with 2 balconies, elevator, 24/7 security & backup generator.',
      address: 'Road 8, Mirpur DOHS',
      city: 'Dhaka',
      area: 'Mirpur',
      propertyType: 'FLAT',
      rentAmount: 32000,
      bedrooms: 3,
      bathrooms: 3,
      isAvailable: true,
    },
  });

  // 5. Create Demo Transport Vehicle
  const vehicle = await prisma.vehicle.upsert({
    where: { licensePlate: 'DHAKA-METRO-TA-11-2233' },
    update: {},
    create: {
      ownerId: landlord.id,
      title: '1.5 Ton Covered Moving Van',
      vehicleType: 'COVERED_VAN',
      licensePlate: 'DHAKA-METRO-TA-11-2233',
      capacity: '1.5 Ton Capacity with 2 Helpers',
      driverName: 'Kamal Hossain',
      driverPhone: '+8801733333333',
      hourlyRate: 1200,
      perKmRate: 65,
      isAvailable: true,
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log('-----------------------------------');
  console.log(`Admin Email    : admin@moveinbd.com`);
  console.log(`Admin Password : admin123456`);
  console.log(`Provider Email : landlord@moveinbd.com`);
  console.log(`Tenant Email   : tenant@moveinbd.com`);
  console.log('-----------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
