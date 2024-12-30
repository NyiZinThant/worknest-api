import express from 'express';
import authController from 'src/controllers/authController';
import validator from 'src/middlewares/validator';
import {
  companyLoginRules,
  companyRegisterRules,
} from 'src/validators/companyValidator';
import {
  userLoginRules,
  userRegisterRules,
} from 'src/validators/userValidator';
// base route /api/v1/auth
const router = express.Router();

// Auth user route
router.post(
  '/user/register',
  userRegisterRules,
  validator,
  authController.registerUser
);
router.post('/user/login', userLoginRules, validator, authController.loginUser);

// Auth company route
router.post(
  '/company/register',
  companyRegisterRules,
  validator,
  authController.registerCompany
);
router.post(
  '/company/login',
  companyLoginRules,
  validator,
  authController.loginCompany
);

export default router;
