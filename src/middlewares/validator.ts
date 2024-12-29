import { NextFunction, Request, Response } from 'express';
import ValidationError from 'src/utils/ValidationError';
import myValidationResult from 'src/utils/customValidationResult';
export default function validator(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = myValidationResult(req);
  if (!errors.isEmpty()) {
    const error = new ValidationError(
      req.originalUrl,
      new Date(),
      errors.array(),
      400
    );
    throw error;
  }
  next();
}
