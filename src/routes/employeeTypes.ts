import express from 'express';
import employeeTypeController from 'src/controllers/employeeTypeController';
// base route /api/v1/employee-types
const router = express.Router();

router.get('/', employeeTypeController.getEmployeeTypes);

export default router;
