import { Router } from 'express';

import companyController from '../controllers/company.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { validateObjectId } from '../middleware/validate-object-id.middleware';
import validateRequest from '../middleware/validation.middleware';
import { UserRole } from '../types/enums';
import {
  createCompanyValidator,
  paginationValidator,
  updateCompanyValidator,
} from '../validators/company.validator';

const router = Router();

router.use(authenticate);

router.post('/', createCompanyValidator, validateRequest, companyController.create);

router.get('/', companyController.findAll);

router.get(
  '/admin',
  authorize(UserRole.ADMIN),
  paginationValidator,
  validateRequest,
  companyController.findAllAdmin,
);

router.get('/:id', validateObjectId('id'), companyController.findById);

router.patch(
  '/:id',
  validateObjectId('id'),
  updateCompanyValidator,
  validateRequest,
  companyController.update,
);

router.delete('/:id', validateObjectId('id'), companyController.delete);

export default router;
