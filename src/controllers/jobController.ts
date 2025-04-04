import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';
const DEFAULT_PAGE = +(process.env.DEFAULT_PAGE || 1);
const DEFAULT_LIMIT = +(process.env.DEFAULT_LIMIT || 10);

// @desc Get all jobs
// @route GET /api/v1/jobs/
const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search = '',
      limit = DEFAULT_LIMIT,
      page = DEFAULT_PAGE,
      mode,
      type,
      min,
      max,
      order,
    } = req.query;
    const where: Prisma.jobWhereInput = {
      position: { contains: search + '' },
      endDate: { gte: new Date() },
    };
    if (min) {
      where.minSalary = { gte: +min };
    }
    if (max) {
      where.maxSalary = { lte: +max };
    }
    if (mode) {
      where.workModeId = +mode;
    }
    if (type) {
      where.employeeTypeId = +type;
    }
    const [jobs, totalJob] = await Promise.all([
      prisma.job.findMany({
        skip: +limit * (+page - 1),
        take: +limit,
        where,
        include: {
          company: {
            select: { name: true },
          },
          work_mode: {
            select: { name: true },
          },
          employee_type: {
            select: { name: true },
          },
        },
        orderBy: {
          id: order === 'desc' ? 'desc' : 'asc',
        },
      }),
      prisma.job.count({ where }),
    ]);
    const mappedJobs = jobs.map((job) => {
      return {
        companyName: job.company.name,
        workMode: job.work_mode.name,
        employeeType: job.employee_type.name,
        position: job.position,
        minSalary: job.minSalary,
        maxSalary: job.maxSalary,
        startDate: job.startDate,
        endDate: job.endDate,
        location: job.location,
      };
    });
    res.status(200).json({
      jobs: mappedJobs,
      metadata: {
        totalJob,
        totalPages: Math.ceil(totalJob / +limit),
        currentPage: page,
      },
    });
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

// @desc Get job by id
// @route GET /api/v1/jobs/:jobId
const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
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
  const whereOption: { userId?: string } = {};
  if (req.profile.type === 'user') {
    whereOption.userId = req.profile.id;
  }
  try {
    const job = await prisma.job.findFirstOrThrow({
      where: {
        id: +jobId,
      },
      include: {
        company: {
          select: {
            name: true,
          },
        },
        work_mode: {
          select: {
            name: true,
          },
        },
        employee_type: {
          select: {
            name: true,
          },
        },
        job_application: {
          where: whereOption,
        },
      },
    });
    res.status(200).json({
      companyName: job.company.name,
      workMode: job.work_mode.name,
      employeeType: job.employee_type.name,
      position: job.position,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      startDate: job.startDate,
      endDate: job.endDate,
      location: job.location,
      information: job.information,
      userJobApplication: job.job_application[0],
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The job with ID ${jobId} does not exist.`,
          'UnknownJob',
          req.originalUrl,
          404
        )
      );
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

// @desc create new job
// @route POST /api/v1/jobs/
const createJob = async (req: Request, res: Response, next: NextFunction) => {
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
    const companyId = req.profile.id;
    const {
      position,
      minSalary,
      maxSalary,
      information,
      startDate,
      endDate,
      location,
      employeeType,
      workMode,
    } = req.body;

    const job = await prisma.job.create({
      data: {
        position,
        companyId,
        information,
        minSalary: +minSalary,
        maxSalary: +maxSalary,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        location,
        employeeTypeId: +employeeType,
        workModeId: +workMode,
      },
    });
    res.status(201).json(job);
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
export default { getJobs, getJobById, createJob };
