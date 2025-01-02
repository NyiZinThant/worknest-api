import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Add new job application
// @route POST /api/v1/job/:jobId/job-application
const addJobApp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.file) {
      next(new ApiError('No resume file found', req.originalUrl, 400));
      return;
    }
    const { jobId } = req.params;
    // fix: after adding authentication middleware
    const userId = 'e7aa3400-f9ff-4e44-b957-19365171ebd9';
    const job = await prisma.job.findFirstOrThrow({
      where: {
        id: +jobId,
      },
    });
    if (new Date() > job.endDate) {
      next(
        new ApiError(
          'The application deadline for this job has passed.',
          req.originalUrl,
          403
        )
      );
      return;
    }
    const newJobApp = await prisma.job_application.create({
      data: {
        jobId: job.id,
        userId: userId,
        resume: req.file.path,
      },
    });
    res.status(201).json(newJobApp);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          'The job you are trying to apply for could not be found.',
          req.originalUrl,
          401
        )
      );
    } else if (e instanceof ApiError) {
      next(e);
    } else {
      next(new ApiError('Internal Server Error', req.originalUrl, 500));
    }
  }
};

export default { addJobApp };
