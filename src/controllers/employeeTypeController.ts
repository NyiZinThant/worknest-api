import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// Get all employeeTypes
// GET /api/v1/employee-types
const getEmployeeTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const employeeTypes = await prisma.employee_type.findMany({
      select: { id: true, name: true },
    });
    res.status(200).json(employeeTypes);
  } catch (e) {
    next(
      new ApiError(
        'Internal server error.',
        'ServerError',
        req.originalUrl,
        500
      )
    );
  }
};

export default { getEmployeeTypes };
