import createError from 'http-errors';
import db from '@/database';

/**
 * POST /roles
 * Create a new role
 */
export const createRole = async (req, res, next) => {
  try {
    const { name } = req.body;

    const existingRole = await db.models.Role.findOne({ where: { name } });
    if (existingRole) {
      return next(createError(400, 'Role with this name already exists'));
    }

    const role = await db.models.Role.create({ name });

    res.status(201).json({
      status: true,
      content: {
        data: role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /roles
 * Get all roles
 */
export const getAll = async (req, res, next) => {
  try {
    const roles = await db.models.Role.findAll();

    res.json({
      status: true,
      content: {
        data: roles,
      },
    });
  } catch (err) {
    next(err);
  }
};
