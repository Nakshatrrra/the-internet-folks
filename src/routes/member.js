import { Router } from 'express';
import * as memberController from '@/controllers/member';
import { isAuthenticated } from '@/middleware';

const router = Router();

router.post('/', isAuthenticated, memberController.addMember);
router.delete('/:id', isAuthenticated, memberController.removeMember);


export default router;
