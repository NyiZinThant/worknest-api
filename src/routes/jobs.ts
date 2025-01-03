import express from 'express';
import jobApplicationController from 'src/controllers/jobApplicationController';
import jobController from 'src/controllers/jobController';
import authenticate from 'src/middlewares/authenticate';
import validator from 'src/middlewares/validator';
import { resumeUpload } from 'src/utils/uploaderUtil';
import { postJobRules } from 'src/validators/jobValidator';

// base route /api/v1/jobs
const router = express.Router();

router.get('/', authenticate(['user', 'company']), jobController.getJobs);
router.get(
  '/:jobId',
  authenticate(['user', 'company']),
  jobController.getJobById
);
router.post(
  '/:jobId/job-applications',
  authenticate(['user']),
  resumeUpload.single('resume'),
  jobApplicationController.addJobApp
);
router.get(
  '/:jobId/job-applications/:jobAppId',
  authenticate(['company', 'user']),
  jobApplicationController.downloadResume
);
router.post(
  '/',
  authenticate(['company']),
  postJobRules,
  validator,
  jobController.createJob
);

export default router;
