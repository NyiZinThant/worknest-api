import express from 'express';
import userController from 'src/controllers/userController';

// base route /api/v1/users/me
const router = express.Router();

router.get('/me', userController.getUser);
router.put('/me', userController.updateUser);

export default router;
