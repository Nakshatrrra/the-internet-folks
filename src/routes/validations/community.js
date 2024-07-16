import { body } from 'express-validator';

export const createRules = [
  body('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
];
