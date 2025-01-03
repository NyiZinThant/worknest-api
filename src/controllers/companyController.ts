import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';

// @desc Get get authenticated user details
// @route GET /api/v1/companies/me
const getCompany = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order } = req.query;
    if (!req.profile) {
      next(
        new ApiError(
          'You do not have permission to access this resource',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const companyId = req.profile.id;
    const { password, ...company } = await prisma.company.findUniqueOrThrow({
      where: {
        id: companyId,
      },
      include: {
        job: {
          orderBy: {
            createdAt: order === 'asc' ? 'asc' : 'desc',
          },
          include: {
            job_application: {
              orderBy: {
                createdAt: 'asc',
              },
            },
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
type UpdateCompanyData = {
  name: string;
  overview: string;
  employeeCount: number;
  logo?: string;
};
const updateCompany = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.profile) {
      next(
        new ApiError(
          'You do not have permission to access this resource',
          req.originalUrl,
          401
        )
      );
      return;
    }
    const companyId = req.profile.id;
    const { name, overview, employeeCount } = req.body;
    const data: UpdateCompanyData = {
      name,
      overview,
      employeeCount: +employeeCount,
    };
    if (req.file) {
      data.logo = req.file.filename;
    }
    const { password, ...updatedCompany } = await prisma.company.update({
      where: {
        id: companyId,
      },
      data: {
        ...data,
      },
    });
    if (!updatedCompany) {
      throw new ApiError('Unknow company', req.originalUrl, 404);
    }
    res.status(200).json(updatedCompany);
  } catch (e) {
    next(new ApiError('Internal Server Error', req.originalUrl, 500));
  }
};

export default { getCompany, getCompanyById, updateCompany };
