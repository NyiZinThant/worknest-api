import express from 'express';
import workModeController from 'src/controllers/workModeController';
import authenticate from 'src/middlewares/authenticate';
// base route /api/v1/work-modes
const router = express.Router();

router.get(
  '/',
  authenticate(['user', 'company']),
  workModeController.getWorkModes
);

export default router;
