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
        resume: req.file.filename,
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

const downloadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobAppId } = req.params;
  try {
    const userId = 'e7aa3400-f9ff-4e44-b957-19365171ebd9';
    const companyId = '00315480-4f6a-4ca8-b418-7df9934e16a3';
    const jobApp = await prisma.job_application.findFirstOrThrow({
      select: {
        userId: true,
        resume: true,
        job: {
          select: {
            companyId: true,
          },
        },
      },
      where: {
        id: jobAppId,
      },
    });
    if (
      (userId && userId === jobApp.userId) ||
      (companyId && companyId === jobApp.job.companyId)
    ) {
      const resumeFullPath = `${import.meta.dirname}/../../uploads/resumes/${
        jobApp.resume
      }`;
      res.status(200).download(resumeFullPath);
      return;
    }
    next(
      new ApiError(
        'You do not have permission to download this resume.',
        req.originalUrl,
        401
      )
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The job application with ID ${jobAppId} does not exist`,
          req.originalUrl,
          404
        )
      );
    }
    if (!(e instanceof ApiError)) {
      next(new ApiError('Internal Server Error', req.originalUrl, 500));
    }
    next(e);
  }
};

export default { addJobApp, downloadResume };
