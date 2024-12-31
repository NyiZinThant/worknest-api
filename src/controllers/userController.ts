import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Get authenticated user details
// @route GET /api/v1/users/me
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // fix: after adding middleware
    const userId = '0bec5c7e-d50f-4a49-a1ea-ba5736894e82';
    const { order } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        education: {
          include: {
            qualification: true,
          },
        },
        experience: true,
        job_application: {
          orderBy: {
            createdAt: order === 'asc' ? 'asc' : 'desc',
          },
          select: {
            resume: true,
            createdAt: true,
            job: {
              select: {
                position: true,
                company: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!user) {
      throw new ApiError('Unknown User', req.originalUrl, 404);
    }
    const { job_application, ...newUser } = user;
    const jobApplications = job_application.map((app) => {
      const newApp = {
        appliedAt: app.createdAt,
        resume: app.resume,
        position: app.job.position,
        company: app.job.company.name,
      };
      return newApp;
    });
    res.status(200).json({ ...newUser, jobApplications });
  } catch (e) {
    next(new ApiError('Internal server error', req.originalUrl, 500));
  }
};

// @desc Update authenticated user
// @route POST /api/v1/users/me
const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export default { getUser, updateUser };
