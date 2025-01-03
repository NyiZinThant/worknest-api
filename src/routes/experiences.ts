import express from 'express';
import experienceController from 'src/controllers/experienceController';
import authenticate from 'src/middlewares/authenticate';
import validator from 'src/middlewares/validator';
import { postExperienceRules } from 'src/validators/experienceValidator';

// base route /api/v1/experiences
const router = express.Router();
router.use(authenticate(['user']));
router.post(
  '/',
  postExperienceRules,
  validator,
  experienceController.addExperience
);
router.delete('/:experienceId', experienceController.removeExperienceById);

export default router;
