import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Get authenticated user details
// @route GET /api/v1/users/me
const getUser = async (req: Request, res: Response, next: NextFunction) => {
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
    const { order, include } = req.query;
    const userArgs: Prisma.userFindUniqueOrThrowArgs = {
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
        job_application: false,
      },
    };
    if (include === 'jobApplications' && userArgs.include) {
      userArgs.include.job_application = {
        orderBy: {
          createdAt: order === 'asc' ? 'asc' : 'desc',
        },
        select: {
          id: true,
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
      };
    }
    const { password, ...user } = await prisma.user.findUniqueOrThrow(userArgs);
    // @ts-ignore
    const jobApplications = user.job_application
      ? // @ts-ignore
        user.job_application.map((app) => {
          const newApp = {
            id: app.id,
            appliedAt: app.createdAt,
            resume: app.resume,
            position: app.job.position,
            company: app.job.company.name,
          };
          return newApp;
        })
      : '';
    res.status(200).json(jobApplications ? { ...user, jobApplications } : user);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          'Cannot find authenticated user',
          'UnknownUser',
          req.originalUrl,
          404
        )
      );
    } else {
      next(
        new ApiError(
          'Internal Server Error',
          'ServerError',
          req.originalUrl,
          500
        )
      );
    }
  }
};

// @desc Get user details
// @route GET /api/v1/users/:userId
const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const { password, ...user } = await prisma.user.findFirstOrThrow({
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
      },
    });
    res.status(200).json(user);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          `The user with ID ${userId} does not exist.`,
          'UnknownUser',
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

type UpdateUserData = {
  name: string;
  dateOfBirth: Date;
  gender: string;
  bio?: string;
  profileImage?: string;
};
// @desc Update authenticated user
// @route PUT /api/v1/users/me
const updateUser = async (req: Request, res: Response, next: NextFunction) => {
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
    const { fullName, dob, gender, bio } = req.body;
    const data: UpdateUserData = {
      name: fullName,
      dateOfBirth: new Date(dob),
      gender: gender,
    };
    if (req.file) {
      data.profileImage = req.file.path;
    }
    if (bio) {
      data.bio = bio;
    }
    const { password, ...updateUser } = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...data,
      },
    });
    if (!updateUser) {
      throw new ApiError(
        `The user with ID ${userId} does not exist.`,
        'UnknownUser',
        req.originalUrl,
        404
      );
    }
    res.status(200).json(updateUser);
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

export default { getUser, getUserById, updateUser };
