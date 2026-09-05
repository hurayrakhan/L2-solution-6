import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { VehicleController } from './vehicle.controller.js';
import { VehicleValidation } from './vehicle.validation.js';

const router = Router();

router.post(
  '/',
  auth('PROVIDER', 'ADMIN'),
  validateRequest(VehicleValidation.createVehicleSchema),
  VehicleController.createVehicle
);

router.get('/', VehicleController.getAllVehicles);
router.get('/:id', VehicleController.getVehicleById);

router.patch(
  '/:id',
  auth('PROVIDER', 'ADMIN'),
  validateRequest(VehicleValidation.updateVehicleSchema),
  VehicleController.updateVehicle
);

router.delete('/:id', auth('PROVIDER', 'ADMIN'), VehicleController.deleteVehicle);

export default router;
