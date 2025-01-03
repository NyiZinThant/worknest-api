import express from 'express';
import employeeTypeController from 'src/controllers/employeeTypeController';
import authenticate from 'src/middlewares/authenticate';
// base route /api/v1/employee-types
const router = express.Router();

router.get(
  '/',
  authenticate(['user', 'company']),
  employeeTypeController.getEmployeeTypes
);

export default router;
