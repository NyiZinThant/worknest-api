import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
type Where = {
  minSalary?: {
    gte: number;
  };
  maxSalary?: {
    lte: number;
  };
  workModeId?: number;
  employeeTypeId?: number;
  endDate?: { gte: Date };
};

// @desc Get all jobs
// @route GET /api/v1/jobs/
const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      limit = DEFAULT_LIMIT,
      page = DEFAULT_PAGE,
      mode,
      type,
      min,
      max,
    } = req.query;
    const where: Where = {
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
          id: 'desc',
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
    next(new ApiError('Internal server error', req.originalUrl, 500));
  }
};

// @desc Get job by id
// @route GET /api/v1/jobs/:jobId
const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  const { jobId } = req.params;
  // fix: after adding authentication middleware
  const userId = 'e7aa3400-f9ff-4e44-b957-19365171ebd9';
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
          where: {
            userId: userId,
          },
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
          `The job with ID ${jobId} does not exist`,
          req.originalUrl,
          404
        )
      );
    } else {
      next(new ApiError('Internal Server Error', req.originalUrl, 500));
    }
  }
};

// @desc create new job
// @route POST /api/v1/jobs/
const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
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
    // fix: after adding middleware
    const companyId = '00315480-4f6a-4ca8-b418-7df9934e16a3';
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
      e = new ApiError('Internal server error', req.originalUrl, 500);
    }
    next(e);
  }
};
export default { getJobs, getJobById, createJob };
