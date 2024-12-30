import express from 'express';
import authController from 'src/controllers/authController';
import validator from 'src/middlewares/validator';
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

export default router;
