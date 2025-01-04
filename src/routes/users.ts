import express from 'express';
import userController from 'src/controllers/userController';
import authenticate from 'src/middlewares/authenticate';
import validator from 'src/middlewares/validator';
import { imageUpload } from 'src/utils/uploaderUtil';
import { userUpdateRules } from 'src/validators/userValidator';

// base route /api/v1/users/me
const router = express.Router();

router.get('/', authenticate(['user', 'company']), userController.getUsers);
router.get('/me', authenticate(['user']), userController.getUser);
router.get(
  '/:userId',
  authenticate(['user', 'company']),
  userController.getUserById
);
router.put(
  '/me',
  authenticate(['user']),
  imageUpload.single('profileImage'),
  userUpdateRules,
  validator,
  userController.updateUser
);
export default router;
