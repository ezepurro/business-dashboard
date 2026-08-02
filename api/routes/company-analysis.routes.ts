import { Router } from 'express';
import analysisController from '../controllers/analysis.controller';

const router = Router({ mergeParams: true });

router.get('/', analysisController.findByCompany);

export default router;
