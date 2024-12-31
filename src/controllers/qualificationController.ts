import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Get all qualifications
// @route GET /api/v1/qualification/
const getQualifications = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const qualifications = await prisma.qualification.findMany();
    res.status(200).json(qualifications);
  } catch (e) {
    next(new ApiError('Inetrnal Server Error', req.originalUrl, 500));
  }
};

export default { getQualifications };
