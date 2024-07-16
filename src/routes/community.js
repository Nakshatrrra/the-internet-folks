import { Router } from 'express';

import * as communityController from '@/controllers/community';
import * as communityValidations from '@/routes/validations/community';
import { isAuthenticated, validate } from '@/middleware';

const router = Router();

router.post('/',isAuthenticated, validate(communityValidations.createRules), communityController.createCommunity);
router.get('/', communityController.getAllCommunities);

router.get('/:id/members', communityController.getCommunityMembers);

router.get('/me/owner', isAuthenticated, communityController.getMyOwnedCommunities);

router.get('/me/member', isAuthenticated, communityController.getMyJoinedCommunities);


export default router;
