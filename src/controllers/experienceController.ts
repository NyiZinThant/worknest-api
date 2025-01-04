import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Create new experience
// @route POST /api/v1/experience
const addExperience = async (
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
    const {
      position,
      companyName,
      description,
      startDate,
      endDate = null,
    } = req.body;
    const experience = await prisma.experience.create({
      data: {
        position,
        companyName,
        description,
        userId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });
    res.status(201).json(experience);
  } catch (e) {
    if (!(e instanceof ApiError)) {
      e = new ApiError(
        'Internal server error.',
        'ServerError',
        req.originalUrl,
        500
      );
    }
    next(e);
  }
};

// @desc Remove experience
// @route DELETE /api/v1/experiences/:experienceId
const removeExperienceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { experienceId } = req.params;
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
    const experience = await prisma.experience.findFirstOrThrow({
      where: {
        id: experienceId,
      },
    });
    if (experience.userId !== userId) {
      next(
        new ApiError(
          'You do not have permission to delete this experience data',
          'AccessDenied',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const deletedExperience = await prisma.experience.delete({
      where: {
        id: experienceId,
      },
    });
    res.status(204).json(deletedExperience);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The experience with ID ${experienceId} does not exist.`,
          'UnknownExperience',
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
export default { addExperience, removeExperienceById };
