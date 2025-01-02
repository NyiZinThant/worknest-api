import express from 'express';
import jobApplicationController from 'src/controllers/jobApplicationController';
import jobController from 'src/controllers/jobController';
import validator from 'src/middlewares/validator';
import { resumeUpload } from 'src/utils/uploaderUtil';
import { postJobRules } from 'src/validators/jobValidator';

// base route /api/v1/jobs
const router = express.Router();

router.get('/', jobController.getJobs);
router.get('/:jobId', jobController.getJobById);
router.post(
  '/:jobId/job-applications',
  resumeUpload.single('resume'),
  jobApplicationController.addJobApp
);
router.get(
  '/:jobId/job-applications/:jobAppId',
  jobApplicationController.downloadResume
);
router.post('/', postJobRules, validator, jobController.createJob);

export default router;
