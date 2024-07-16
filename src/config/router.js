import authRouter from '@/routes/auth';
import authRouter2 from '@/routes/auth2';
import roleRouter from '@/routes/role';
import indexRouter from '@/routes/index';
import communityRouter from '@/routes/community';
import memberRouter from '@/routes/member';
import tweetRouter from '@/routes/tweet';

export default function (app) {
  app.use('/', indexRouter);
  app.use('/auth', authRouter);
  app.use('/v1/auth', authRouter2);
  app.use('/v1/role', roleRouter);
  app.use('/v1/community', communityRouter);
  app.use('/v1/member', memberRouter);
  app.use('/tweets', tweetRouter);
}
