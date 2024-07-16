import createError from 'http-errors';
import { DataTypes, Model } from 'sequelize';
import { generateToken, verifyToken } from '@/helpers/token';
import bcrypt from 'bcrypt';

import db from '@/database';

/**
 * POST /auth/signin
 * Login request
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await db.models.User.findOne({ where: { email } });
    if (!user) {
      return next(createError(400, 'There is no user with this email address!'));
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return next(createError(400, 'Incorrect password!'));
    }

    // Generate token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // Prepare response
    const responseData = {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at.toISOString(),
        },
        meta: {
          access_token: token,
        },
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error('Error in login:', err);
    next(err);
  }
};


/**
 * POST /auth/signup
 * Register request
 */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.models.User.create({
      name,
      email,
      password: hashedPassword, 
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    const responseData = {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        meta: {
          access_token: token,
        },
      },
    };

    res.status(201).json(responseData);
  } catch (err) {
    console.error('Error in registration:', err);
    next(err);
  }
};


/**
 * GET /auth/me
 * Get current user
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    const currentUser = req.user;

    const user = await db.models.User.findByPk(currentUser.id);

    if (!user) {
      const error = createError(404, 'User not found!');
      return next(error);
    }

    const responseData = {
      status: true,
      content: {
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.createdAt.toISOString(),
        },
      },
    };

    res.json(responseData);
  } catch (err) {
    next(err);
  }
};


/**
 * PUT /auth/me
 * Update current user
 */
export const updateCurrentUser = async (req, res, next) => {
  try {
    await req.user.update(req.body, {
      fields: ['firstName', 'lastName', 'email'],
    });
    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /auth/me
 * Delete current user
 */
export const deleteCurrentUser = async (req, res, next) => {
  try {
    await req.user.destroy();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /auth/me/password
 * Update password of current user
 */
export const updatePassword = async (req, res, next) => {
  try {
    const { current, password } = req.body;

    // Check user password
    const isValidPassword = await req.user.validatePassword(current);
    if (!isValidPassword) {
      return next(createError(400, 'Incorrect password!'));
    }

    // Update password
    req.user.password = password;
    await req.user.save();

    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
};
