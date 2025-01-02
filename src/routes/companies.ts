import express from 'express';
import companyController from 'src/controllers/companyController';

// base route /api/v1/companies
const router = express.Router();

router.get('/me', companyController.getCompany);
router.get('/:companyId', companyController.getCompanyById);

export default router;
