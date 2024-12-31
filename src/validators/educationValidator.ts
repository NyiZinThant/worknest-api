import { body } from 'express-validator';

export const postEducationRules = [
  body('fieldOfStudy').trim().escape().notEmpty().withMessage('Required'),
  body('qualificationId').trim().escape().notEmpty().withMessage('Required'),
  body('institution').trim().escape().notEmpty().withMessage('Required'),
  body('startDate')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format'),
  body('endDate')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format')
    .bail()
    .custom((val, { req }) => {
      if (new Date(val) <= new Date(req.body.startDate)) {
        throw new Error('endDate must be greater than startDate');
      }
      return true;
    })
    .withMessage('Must be gretaer than startDate'),
];
