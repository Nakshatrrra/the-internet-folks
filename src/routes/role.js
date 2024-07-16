import { Router } from 'express';

import * as roleController from '@/controllers/role';
import * as roleValidations from '@/routes/validations/role';
import { isAuthenticated, validate } from '@/middleware';

const router = Router();

router.post('/', validate(roleValidations.validateCreate), roleController.createRole);


router.route('/')
  .get( roleController.getAll);

export default router;
