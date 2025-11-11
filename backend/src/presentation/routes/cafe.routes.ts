import { Router } from 'express';
import { container } from 'tsyringe';
import { CafeController } from '../controllers/CafeController';
import { upload } from '../middleware/upload';

const router = Router();
const cafeController = container.resolve(CafeController);

router.get('/', (req, res, next) => cafeController.getCafes(req, res, next));
router.get('/:id', (req, res, next) => cafeController.getCafeById(req, res, next));
router.post('/', upload.single('logo'), (req, res, next) => cafeController.createCafe(req, res, next));
router.put('/', upload.single('logo'), (req, res, next) => cafeController.updateCafe(req, res, next));
router.delete('/:id', (req, res, next) => cafeController.deleteCafe(req, res, next));

export default router;
