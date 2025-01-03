import express from 'express';
import companyController from 'src/controllers/companyController';
import authenticate from 'src/middlewares/authenticate';
import validator from 'src/middlewares/validator';
import { imageUpload } from 'src/utils/uploaderUtil';
import { updateCompanyRules } from 'src/validators/companyValidator';

// base route /api/v1/companies
const router = express.Router();

router.get('/me', authenticate(['company']), companyController.getCompany);
router.put(
  '/me',
  authenticate(['company']),
  imageUpload.single('logo'),
  updateCompanyRules,
  validator,
  companyController.updateCompany
);
router.get(
  '/:companyId',
  authenticate(['comapny', 'user']),
  companyController.getCompanyById
);

export default router;
