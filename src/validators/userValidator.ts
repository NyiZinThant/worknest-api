import { body } from 'express-validator';

export const userRegisterRules = [
  body('fullName').trim().escape().notEmpty().withMessage('Required'),
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isEmail()
    .withMessage('Invalid format'),
  body('dob')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .isDate({
      format: 'YYYY-MM-DD',
    })
    .withMessage('Invalid format'),
  body('gender').trim().escape().notEmpty().withMessage('Required'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters'),
];

export const userLoginRules = [
  body('email')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isEmail()
    .withMessage('Invalid format'),
  body('password')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isLength({ min: 8 })
    .withMessage('Must be at least 8 characters'),
];

export const userUpdateRules = [
  body('fullName').trim().escape().notEmpty().withMessage('Required'),
  body('dob')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format'),
  body('gender').trim().escape().notEmpty().withMessage('Required'),
];
