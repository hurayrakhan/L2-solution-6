import { Router } from 'express';
import { auth } from '../../middlewares/auth.middleware.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { PropertyController } from './property.controller.js';
import { PropertyValidation } from './property.validation.js';

const router = Router();

router.post(
  '/',
  auth('PROVIDER', 'ADMIN'),
  validateRequest(PropertyValidation.createPropertySchema),
  PropertyController.createProperty
);

router.get('/', PropertyController.getAllProperties);

router.get('/:id', PropertyController.getPropertyById);

router.patch(
  '/:id',
  auth('PROVIDER', 'ADMIN'),
  validateRequest(PropertyValidation.updatePropertySchema),
  PropertyController.updateProperty
);

router.delete('/:id', auth('PROVIDER', 'ADMIN'), PropertyController.deleteProperty);

export default router;
