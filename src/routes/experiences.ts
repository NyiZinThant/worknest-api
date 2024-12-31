import express from 'express';
import experienceController from 'src/controllers/experienceController';
import validator from 'src/middlewares/validator';
import { postExperienceRules } from 'src/validators/experienceValidator';

// base route /api/v1/experiences
const router = express.Router();

router.post(
  '/',
  postExperienceRules,
  validator,
  experienceController.addExperience
);
router.delete('/:experienceId', experienceController.removeExperienceById);

export default router;
