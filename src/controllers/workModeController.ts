import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// Get all workModes
// GET /api/v1/work-modes
const getWorkModes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workModes = await prisma.work_mode.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(workModes);
  } catch (e) {
    next(new ApiError('Internal server error', req.originalUrl, 500));
  }
};

export default { getWorkModes };
