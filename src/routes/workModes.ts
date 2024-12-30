import express from 'express';
import workModeController from 'src/controllers/workModeController';
// base route /api/v1/work-modes
const router = express.Router();

router.get('/', workModeController.getWorkModes);

export default router;
