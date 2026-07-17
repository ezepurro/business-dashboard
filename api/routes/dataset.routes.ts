import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { uploadDataset } from '../middleware/upload.middleware';
import { validateObjectId } from '../middleware/validate-object-id.middleware';
import { listDatasetsValidator } from '../validators/dataset.validator';
import datasetController from '../controllers/dataset.controller';
import validateRequest from '../middleware/validation.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get(
  '/',
  validateObjectId('companyId'),
  listDatasetsValidator,
  validateRequest,
  datasetController.findAll,
);
router.get(
  '/:datasetId',
  validateObjectId('companyId'),
  validateObjectId('datasetId'),
  datasetController.findById,
);

router.post(
  '/',
  validateObjectId('companyId'),
  uploadDataset.single('file'),
  datasetController.upload,
);

router.delete(
  '/:datasetId',
  validateObjectId('companyId'),
  validateObjectId('datasetId'),
  datasetController.delete,
);

export default router;
