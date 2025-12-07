import { Router } from 'express';
import multer from 'multer';
import * as providerController from '../controllers/providerController';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload-pdf', upload.single('file'), providerController.uploadPdf);
router.get('/providers', providerController.getProviders);
router.get('/providers/:id', providerController.getProviderDetail);
router.post('/providers/:id/validate', providerController.validateProvider);
router.post('/refresh-all', providerController.refreshAll);
router.get('/dashboard-metrics', providerController.getDashboardMetrics);

export default router;
