import express from 'express';
import qualificationController from 'src/controllers/qualificationController';

// base route /api/v1/qualifications
const router = express.Router();

router.get('/', qualificationController.getQualifications);

export default router;
