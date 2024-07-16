import createError from 'http-errors';
import db from '@/database';
import slugify from 'slugify';
import { Snowflake } from '@theinternetfolks/snowflake';

/**
 * POST /v1/community
 * Create a new community.
 */
export const createCommunity = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { id: owner } = req.user;

    const uniqueString = Snowflake.generate().toString().slice(-6); 
    const slug = `${slugify(name, { lower: true, strict: true })}-${uniqueString}`;

    const communityAdminRole = await db.models.Role.findOne({ where: { name: 'CommunityAdmin' } });
    if (!communityAdminRole) {
      throw createError(400, 'CommunityAdmin role not found');
    }

    const community = await db.models.Community.create({
      name,
      slug,
      owner,
    });

    await db.models.Member.create({
      community: community.id,
      user: community.owner,
      role: communityAdminRole.id,
      created_at: new Date(),
    });

    const newCommunity = await db.models.Community.findByPk(community.id, {
      include: [{
        model: db.models.User,
        as: 'ownerDetails',
        attributes: ['id', 'name', 'email'],
      }],
    });

    const responseData = {
      status: true,
      content: {
        data: newCommunity,
      },
    };

    res.status(201).json(responseData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};



/**
 * GET /v1/community/:id/members
 * List all members of a community with pagination.
 */
export const getCommunityMembers = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.models.Member.findAndCountAll({
      where: { community: id },
      include: [
        {
          model: db.models.User,
          as: 'User',
          attributes: ['id', 'name'], 
        },
        {
          model: db.models.Role,
          as: 'Role',
          attributes: ['id', 'name'],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: totalPages,
          page: parseInt(page),
        },
        data: rows,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.log(err);
    next(err);
  }
};



export const getAllCommunities = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await db.models.Community.findAndCountAll({
      include: [{
        model: db.models.User,
        as: 'ownerDetails',
        attributes: ['id', 'name'],
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: totalPages,
          page: parseInt(page),
        },
        data: rows,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};



export const getMyOwnedCommunities = async (req, res, next) => {
  try {
    const { id: ownerId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await db.models.Community.findAndCountAll({
      where: { owner: ownerId }, 
      include: [
        {
          model: db.models.User,
          as: 'ownerDetails',
          attributes: ['id', 'name'], 
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: totalPages,
          page: parseInt(page),
        },
        data: rows,
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    next(createError(500, 'Failed to fetch owned communities'));
  }
};



/**
 * GET /v1/community/me/member
 * List all communities joined by the currently signed-in user.
 */
export const getMyJoinedCommunities = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows } = await db.models.Member.findAndCountAll({
      where: { user: userId },
      include: [
        {
          model: db.models.Community,
          as: 'Community',
          include: [
            {
              model: db.models.User,
              as: 'ownerDetails',
              attributes: ['id', 'name'],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']],
    });

    const totalPages = Math.ceil(count / limit);

    const responseData = {
      status: true,
      content: {
        meta: {
          total: count,
          pages: totalPages,
          page: parseInt(page),
        },
        data: rows.map(row => ({
          id: row.Community.id,
          name: row.Community.name,
          slug: row.Community.slug,
          owner: row.Community.ownerDetails,
          created_at: row.Community.created_at,
          updated_at: row.Community.updated_at,
        })),
      },
    };

    res.status(200).json(responseData);
  } catch (err) {
    console.error(err);
    next(createError(500, 'Failed to fetch joined communities'));
  }
};