import { body } from 'express-validator';

export const postExperienceRules = [
  body('position').trim().escape().notEmpty().withMessage('Required'),
  body('description').trim().escape().notEmpty().withMessage('Required'),
  body('companyName').trim().escape().notEmpty().withMessage('Required'),
  body('startDate')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Required')
    .bail()
    .isDate()
    .withMessage('Wrong format'),
];
