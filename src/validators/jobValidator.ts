import { body } from 'express-validator';

export const postJobRules = [
  body('position').trim().escape().notEmpty().withMessage('Required'),
  body('minSalary')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isNumeric()
    .withMessage('Wrong format')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Must be greater than 0'),
  body('maxSalary')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isNumeric()
    .withMessage('Wrong format')
    .bail()
    .isFloat({ gt: 0 })
    .withMessage('Must be greater than 0')
    .bail()
    .custom((val: number, { req }) => {
      if (val < req.body.minSalary) {
        throw new Error('maxSalary must be greater than minSalary');
      }
      return true;
    })
    .withMessage('Must be greater than minSalary'),
  body('information').escape().notEmpty().withMessage('Required'),
  body('startDate')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format'),
  body('endDate')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format')
    .custom((val, { req }) => {
      if (new Date(val) <= new Date(req.body.startDate)) {
        throw new Error('endDate must be greater than startDate');
      }
      return true;
    })
    .withMessage('Must be gretaer than startDate'),
  body('location').trim().escape().notEmpty().withMessage('Required'),
  body('employeeType')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isNumeric()
    .withMessage('Wrong format'),
  body('workMode')
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isNumeric()
    .withMessage('Wrong format'),
];
