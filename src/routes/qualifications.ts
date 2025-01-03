import express from 'express';
import qualificationController from 'src/controllers/qualificationController';
import authenticate from 'src/middlewares/authenticate';

// base route /api/v1/qualifications
const router = express.Router();

router.get(
  '/',
  authenticate(['user', 'company']),
  qualificationController.getQualifications
);

export default router;
