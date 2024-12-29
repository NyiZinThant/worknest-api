import { NextFunction, Request, Response } from 'express';
import ApiError from 'src/utils/ApiError';
import ValidationError from 'src/utils/ValidationError';

const errorHandler = (
  err: ApiError | ValidationError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (isExactInstance(err, Error)) {
    err = new ApiError('Internal Server Error', 'unknown', new Date(), 500);
  }
  res.status((err as ApiError).code).json(err);
};

function isExactInstance(obj: Object, classFunction: Function): boolean {
  return Object.getPrototypeOf(obj) === classFunction.prototype;
}
export default errorHandler;
