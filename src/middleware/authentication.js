import db from '@/database';
import { tokenHelper } from '@/helpers';
import createError from 'http-errors';

export default async function authenticate(req, res, next) {
  const authorization = req.headers.authorization || '';
  const refreshToken = req.headers.refreshtoken || '';

  req.user = null;

  if (!authorization) {
    return next();
  }

  if (!authorization.startsWith('Bearer ')) {
    return next();
  }

  const token = authorization.substring(7);
  let tokenData = null;

  try {
    tokenData = await tokenHelper.verifyToken(token);
  } catch (err) {
    console.log(err);
    const error = createError(401, 'Token expired!');
    return next(error);
  }

  try {
    const user = await db.models.User.findByPk(tokenData.id);

    // Check if user exists
    if (!user) {
      return next(createError(401, 'User not found!'));
    }

    // Set request user
    req.user = user;

    // Check if the token renewal time is coming
    const now = new Date();
    const exp = new Date(tokenData.exp * 1000);
    const difference = exp.getTime() - now.getTime();
    const minutes = Math.round(difference / 60000);

    // Check for refresh token and time left
    if (refreshToken && minutes < 15) {
      // Verify refresh token and get refresh token data
      const refreshTokenData = await tokenHelper.verifyToken(refreshToken);

      // Check the user of refresh token
      if (refreshTokenData.id === tokenData.id) {
        // Generate new tokens
        const newToken = user.generateToken();
        const newRefreshToken = user.generateToken('2h');

        // Set response headers
        res.setHeader('Token', newToken);
        res.setHeader('RefreshToken', newRefreshToken);
      }
    }

    // Go to next middleware
    return next();
  } catch (error) {
    return next(error);
  }
}
