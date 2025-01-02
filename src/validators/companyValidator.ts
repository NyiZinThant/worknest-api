import { body } from 'express-validator';

export const companyRegisterRules = [
  body('name').trim().escape().notEmpty().withMessage('Required'),
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

export const companyLoginRules = [
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

export const updateCompanyRules = [
  body('name').trim().escape().notEmpty().withMessage('Required'),
  body('overview').trim().escape().notEmpty().withMessage('Required'),
  body('employeeCount')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isNumeric()
    .withMessage('Wrong data type'),
];
