import express from 'express';
import companyController from 'src/controllers/companyController';
import validator from 'src/middlewares/validator';
import { imageUpload } from 'src/utils/uploaderUtil';
import { updateCompanyRules } from 'src/validators/companyValidator';

// base route /api/v1/companies
const router = express.Router();

router.get('/me', companyController.getCompany);
router.put(
  '/me',
  imageUpload.single('logo'),
  updateCompanyRules,
  validator,
  companyController.updateCompany
);
router.get('/:companyId', companyController.getCompanyById);

export default router;
