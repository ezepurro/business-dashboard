import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { validateObjectId } from '../middleware/validate-object-id.middleware';
import analysisController from '../controllers/analysis.controller';

const router = Router();

router.use(authenticate);

router.get('/:id', validateObjectId('id'), analysisController.findById);

export default router;
