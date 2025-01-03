import express from 'express';
import educationController from 'src/controllers/educationController';
import authenticate from 'src/middlewares/authenticate';
import validator from 'src/middlewares/validator';
import { postEducationRules } from 'src/validators/educationValidator';

// base route /api/v1/educations
const router = express.Router();
router.use(authenticate(['user']));
router.post(
  '/',
  postEducationRules,
  validator,
  educationController.addEducation
);
router.delete('/:educationId', educationController.removeEducationById);

export default router;
