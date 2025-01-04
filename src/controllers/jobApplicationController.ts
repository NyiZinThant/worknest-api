import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Add new job application
// @route POST /api/v1/job/:jobId/job-application
const addJobApp = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  try {
    if (!req.file) {
      next(
        new ApiError('No resume file found.', 'NoResume', req.originalUrl, 400)
      );
      return;
    }
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
    const job = await prisma.job.findFirstOrThrow({
      where: {
        id: +jobId,
      },
    });
    if (new Date() > job.endDate) {
      next(
        new ApiError(
          'The application deadline for this job has passed.',
          'DeadlinePassed',
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
          `The job with ID ${jobId} does not exist.`,
          'UnknownJob',
          req.originalUrl,
          401
        )
      );
    } else if (e instanceof ApiError) {
      next(e);
    } else {
      next(
        new ApiError(
          'Internal server error',
          'ServerError',
          req.originalUrl,
          500
        )
      );
    }
  }
};

// @desc download resume file
// @route GET /api/v1/job/:jobId/job-application/:jobAppId
const downloadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { jobId, jobAppId } = req.params;
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
    const companyId = req.profile.type === 'company' && req.profile.id;
    const userId = req.profile.type === 'user' && req.profile.id;
    const jobApp = await prisma.job_application.findFirstOrThrow({
      select: {
        userId: true,
        resume: true,
        job: {
          select: {
            id: true,
            companyId: true,
          },
        },
      },
      where: {
        id: jobAppId,
      },
    });
    if (jobApp.job.id !== +jobId) {
      next(
        new ApiError(
          `The job application with ID ${jobAppId} does not exist in job ID ${jobId}.`,
          'UnknownJobApp',
          req.originalUrl,
          404
        )
      );
      return;
    }
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
        'AccessDenied',
        req.originalUrl,
        401
      )
    );
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The job application with ID ${jobAppId} does not exist in job ID ${jobId}.`,
          'UnknownJobApp',
          req.originalUrl,
          404
        )
      );
    }
    if (!(e instanceof ApiError)) {
      next(
        new ApiError(
          'Internal server error.',
          'ServerError',
          req.originalUrl,
          500
        )
      );
    }
    next(e);
  }
};

export default { addJobApp, downloadResume };
