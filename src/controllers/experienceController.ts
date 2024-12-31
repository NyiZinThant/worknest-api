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
    // fix: after adding authentication
    const userId = '8e2a8372-cf68-4b3a-b9e9-0f8d62d19cf0';
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
      e = new ApiError('Internal server error', req.originalUrl, 500);
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
  try {
    const { experienceId } = req.params;
    // fix: after adding authetication middleware
    const userId = '8e2a8372-cf68-4b3a-b9e9-0f8d62d19cf0';
    const experience = await prisma.experience.findFirst({
      where: {
        id: experienceId,
      },
    });
    if (!experience) {
      next(
        new ApiError(
          'Experience data not found. The specified ID does not exist',
          req.originalUrl,
          404
        )
      );
      return;
    }
    if (experience.userId !== userId) {
      next(
        new ApiError(
          'Unauthorized access. You do not have permission to delete this experience data',
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
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2001') {
      e = new ApiError(
        'Experience data not found. The specified ID does not exist',
        req.originalUrl,
        404
      );
    }
    next(e);
  }
};
export default { addExperience, removeExperienceById };
