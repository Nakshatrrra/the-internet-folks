import { Router } from 'express';

import * as tweetController from '@/controllers/tweet';
import * as tweetValidations from '@/routes/validations/tweet';
import { cache, isAuthenticated, validate } from '@/middleware';

const router = Router();

router.route('/')
  .get(isAuthenticated, validate(tweetValidations.listTweetsRules), tweetController.getTweets)
  .post(isAuthenticated, validate(tweetValidations.createTweetRules), tweetController.createTweet);

router.route('/:id')
  .get(isAuthenticated, tweetController.getTweetById)
  .delete(isAuthenticated, tweetController.deleteTweet);

export default router;
