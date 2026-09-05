import { Router } from 'express';
import authRouter from '../modules/auth/auth.route.js';
import userRouter from '../modules/user/user.route.js';
import propertyRouter from '../modules/property/property.route.js';
import utilityRouter from '../modules/utility/utility.route.js';
import vehicleRouter from '../modules/vehicle/vehicle.route.js';
import bookingRouter from '../modules/booking/booking.route.js';
import paymentRouter from '../modules/payment/payment.route.js';
import adminRouter from '../modules/admin/admin.route.js';

const router = Router();

const moduleRoutes = [
  { path: '/auth', route: authRouter },
  { path: '/users', route: userRouter },
  { path: '/properties', route: propertyRouter },
  { path: '/utilities', route: utilityRouter },
  { path: '/vehicles', route: vehicleRouter },
  { path: '/bookings', route: bookingRouter },
  { path: '/payments', route: paymentRouter },
  { path: '/admin', route: adminRouter },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
