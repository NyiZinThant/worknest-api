import express from 'express';
import jobApplicationController from 'src/controllers/jobApplicationController';
import jobController from 'src/controllers/jobController';
import validator from 'src/middlewares/validator';
import { postJobRules } from 'src/validators/jobValidator';

// base route /api/v1/jobs
const router = express.Router();

router.get('/', jobController.getJobs);
router.get('/:jobId', jobController.getJobById);
router.post('/:jobId/job-applications', jobApplicationController.addJobApp);
router.post('/', postJobRules, validator, jobController.createJob);

export default router;
