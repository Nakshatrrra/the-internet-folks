import { Router } from 'express';

import * as authController from '@/controllers/auth2';
import * as authValidations from '@/routes/validations/auth';
import { isAuthenticated, validate } from '@/middleware';

const router = Router();

router.post('/signin', validate(authValidations.loginRules), authController.login);

router.post('/signup', validate(authValidations.registerRules), authController.register);

router.route('/me')
  .get(isAuthenticated, authController.getCurrentUser);

router.put('/me/password',
  isAuthenticated,
  validate(authValidations.changePasswordRules),
  authController.updatePassword);

export default router;
