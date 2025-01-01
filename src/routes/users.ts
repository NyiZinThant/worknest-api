import express from 'express';
import userController from 'src/controllers/userController';
import validator from 'src/middlewares/validator';
import { userUpdateRules } from 'src/validators/userValidator';

// base route /api/v1/users/me
const router = express.Router();

router.get('/me', userController.getUser);
router.get('/:userId', userController.getUserById);
router.put('/me', userUpdateRules, validator, userController.updateUser);
export default router;
