import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Create new education
// @route POST /api/v1/educations
const addEducation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // fix: after adding authentication
    const userId = '8e2a8372-cf68-4b3a-b9e9-0f8d62d19cf0';
    const { fieldOfStudy, qualificationId, institution, startDate, endDate } =
      req.body;
    const education = await prisma.education.create({
      data: {
        fieldOfStudy,
        qualificationId,
        institution,
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });
    if (!education) {
      next(new ApiError('Unknown qualification id', req.originalUrl, 400));
      return;
    }
    res.status(201).json(education);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
      e = new ApiError('Unknown qualification id', req.originalUrl, 404);
    }
    next(e);
  }
};

// @desc Remove education
// @route DELETE /api/v1/educations/:educationId
const removeEducationById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { educationId } = req.params;
    // fix: after adding authetication middleware
    const userId = '8e2a8372-cf68-4b3a-b9e9-0f8d62d19cf0';
    const education = await prisma.education.findFirst({
      where: {
        id: educationId,
      },
    });
    if (!education) {
      next(
        new ApiError(
          'Education data not found. The specified ID does not exist',
          req.originalUrl,
          404
        )
      );
      return;
    }
    if (education.userId !== userId) {
      next(
        new ApiError(
          'Unauthorized access. You do not have permission to delete this education data',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const deletedEducation = await prisma.education.delete({
      where: {
        id: educationId,
      },
    });
    res.status(204).json(deletedEducation);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2001') {
      e = new ApiError(
        'Education data not found. The specified ID does not exist',
        req.originalUrl,
        404
      );
    }
    next(e);
  }
};
export default { addEducation, removeEducationById };
