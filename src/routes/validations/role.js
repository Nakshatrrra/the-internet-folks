import { body } from 'express-validator';

export const validateCreate = [
  body('name').exists(),
];