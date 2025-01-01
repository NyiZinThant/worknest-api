import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Get get authenticated user details
// @route GET /api/v1/companies/me
const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // fix: after adding middleware
    const { order } = req.query;
    const companyId = '00315480-4f6a-4ca8-b418-7df9934e16a3';
    const { password, ...company } = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyId,
      },
      include: {
        job: {
          orderBy: {
            createdAt: order === 'asc' ? 'asc' : 'desc',
          },
        },
      },
    });
    res.status(200).json(company);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(new ApiError('Unknow Company', req.originalUrl, 401));
    } else {
      next(new ApiError('Internal Server Error', req.originalUrl, 500));
    }
  }
};

// @desc Get get authenticated user details
// @route GET /api/v1/companies/me
const getCompanyById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // fix: after adding middleware
    const { order } = req.query;
    const { companyId } = req.params;
    const { password, ...company } = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyId,
      },
      include: {
        job: {
          orderBy: {
            createdAt: order === 'asc' ? 'asc' : 'desc',
          },
        },
      },
    });
    res.status(200).json(company);
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(new ApiError('Unknow Company', req.originalUrl, 401));
    } else {
      next(new ApiError('Internal Server Error', req.originalUrl, 500));
    }
  }
};

export default { getCompany, getCompanyById };
