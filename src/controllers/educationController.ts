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
    if (!req.profile) {
      next(
        new ApiError(
          'You do not have permission to access this resource.',
          'AccessDenied',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const userId = req.profile.id;
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
      next(
        new ApiError(
          `The qualification does not exist.`,
          'UnknownQualification',
          req.originalUrl,
          400
        )
      );
      return;
    }
    res.status(201).json(education);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003') {
      e = new ApiError(
        `The qualification does not exist.`,
        'UnknownQualification',
        req.originalUrl,
        404
      );
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
  const { educationId } = req.params;
  try {
    if (!req.profile) {
      next(
        new ApiError(
          'You do not have permission to access this resource.',
          'AccessDenied',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const userId = req.profile.id;
    const education = await prisma.education.findFirstOrThrow({
      where: {
        id: educationId,
      },
    });
    if (education.userId !== userId) {
      next(
        new ApiError(
          'You do not have permission to delete this education data.',
          'AccessDenied',
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
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The education with ID ${educationId} does not exist.`,
          'UnknownEducation',
          req.originalUrl,
          404
        )
      );
    } else {
      next(
        new ApiError(
          'Internal server error.',
          'ServerError',
          req.originalUrl,
          500
        )
      );
    }
  }
};
export default { addEducation, removeEducationById };
