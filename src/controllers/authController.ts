import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { compare, hash } from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import prisma from 'src/config/prisma';
import ApiError from 'src/utils/ApiError';
import jwtUtil from 'src/utils/jwtUtil';
const saltRounds = process.env.SALT_ROUND ? +process.env.SALT_ROUND : 10;

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
        'The email is already in use. Please try a different one',
        req.originalUrl,
        new Date(),
        409
      );
    }
    next(e);
  }
};

const loginUser = async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    const result = user ? await compare(password, user.password) : false;
    if (!result) {
      const e = new ApiError(
        'Incorrect email or password',
        req.originalUrl,
        new Date(),
        401
      );
      next(e);
      return;
    }
    const payload = {
      fullName: user?.name,
      email: user?.email,
      dob: user?.dateOfBirth,
      gender: user?.gender,
      isUser: true,
    };
    const accessToken = jwtUtil.generateToken(payload);
    res.status(200).json({
      accessToken,
      user: payload,
    });
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError && e.code === 'P2001') {
      e = new ApiError(
        'Incorrect email or password',
        req.originalUrl,
        new Date(),
        401
      );
    }
    next(e);
  }
};

export default { registerUser, loginUser };
