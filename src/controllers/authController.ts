import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { compare, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';
import jwtUtil from 'src/utils/jwtUtil';
const saltRounds = process.env.SALT_ROUND ? +process.env.SALT_ROUND : 10;

// @desc Register new user
// @route POST /api/v1/auth/user/register
const registerUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { fullName, email, dob, gender, password } = req.body;
    const hashedPassword = await hash(password, saltRounds);
    const user = await prisma.user.create({
      data: {
        name: fullName,
        email,
        dateOfBirth: new Date(dob),
        gender,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      fullName: user.name,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      e = new ApiError(
        'The email is already in use. Please try a different one.',
        'EmailAlreadyInUse',
        req.originalUrl,
        409
      );
    }
    next(e);
  }
};

// @desc Login new user
// @route POST /api/v1/auth/user/login
const loginUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
    });
    const result = user ? await compare(password, user.password) : false;
    if (!result) {
      const e = new ApiError(
        'Incorrect email or password.',
        'InvalidCredentials',
        req.originalUrl,
        401
      );
      next(e);
      return;
    }
    const { access, refresh } = jwtUtil.generateTokens({
      id: user.id,
      type: 'user',
    });
    res.cookie('accessToken', access.token, {
      secure: true,
      httpOnly: true,
      maxAge: access.exp,
    });
    res.cookie('refreshToken', refresh.token, {
      secure: true,
      httpOnly: true,
      maxAge: refresh.exp,
    });
    res.status(200).json({
      id: user.id,
      fullName: user.name,
      email: user.email,
      dob: user.dateOfBirth,
      gender: user.gender,
      type: 'user',
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          'Incorrect email or password.',
          'InvalidCredentials',
          req.originalUrl,
          401
        )
      );
    } else {
      next(
        new ApiError(
          'Internal server error.',
          'Server Error',
          req.originalUrl,
          500
        )
      );
    }
  }
};

// @desc Register new company
// @route POST /api/v1/auth/company/register
const registerCompany = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await hash(password, saltRounds);
    const company = await prisma.company.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({
      name: company.name,
      email: company.email,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002') {
      e = new ApiError(
        'The email is already in use. Please try a different one.',
        'EmailAlreadyInUse',
        req.originalUrl,
        409
      );
    }
    next(e);
  }
};

// @desc Login new company
// @route POST /api/v1/auth/company/login
const loginCompany = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const company = await prisma.company.findFirstOrThrow({
      where: {
        email,
      },
    });
    const result = company ? await compare(password, company.password) : false;
    if (!result) {
      const e = new ApiError(
        'Incorrect email or password.',
        'InvalidCredentials',
        req.originalUrl,
        401
      );
      next(e);
      return;
    }
    const { access, refresh } = jwtUtil.generateTokens({
      id: company.id,
      type: 'company',
    });
    res.cookie('accessToken', access.token, {
      secure: true,
      httpOnly: true,
      maxAge: access.exp,
    });
    res.cookie('refreshToken', refresh.token, {
      secure: true,
      httpOnly: true,
      maxAge: refresh.exp,
    });
    res.status(200).json({
      id: company.id,
      name: company.name,
      email: company.email,
      type: 'company',
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025') {
      next(
        new ApiError(
          'Incorrect email or password.',
          'InvalidCredentials',
          req.originalUrl,
          401
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
export default { registerUser, loginUser, registerCompany, loginCompany };
