import createError from 'http-errors';
import db from '@/database';

/**
 * POST /v1/member
 * Add a new member to a community.
 */
export const addMember = async (req, res, next) => {
  try {
    const { community, user, role } = req.body;
    const { id: currentUserId } = req.user;

    const currentMember = await db.models.Member.findOne({
      where: { community, user: currentUserId },
      include: [
        {
          model: db.models.Role,
          as: 'Role',
          attributes: ['name'],
        },
      ],
    });

    if (!currentMember || currentMember.Role.name !== 'Community Admin') {
      return next(createError(403, 'NOT_ALLOWED_ACCESS'));
    }

    const existingMember = await db.models.Member.findOne({
      where: { community, user },
    });

    if (existingMember) {
      return next(createError(409, 'USER_ALREADY_MEMBER'));
    }

    const newMember = await db.models.Member.create({ community, user, role });

    res.status(201).json({
      status: true,
      data: newMember,
    });
  } catch (err) {
    console.error(err);
    next(createError(500, 'Failed to add member'));
  }
};


/**
 * DELETE /v1/member/:id
 * Remove a member from a community.
 */
export const removeMember = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { id: currentUserId } = req.user;
  
      const memberToRemove = await db.models.Member.findByPk(id);
  
      if (!memberToRemove) {
        return next(createError(404, 'MEMBER_NOT_FOUND'));
      }
  
      const { community } = memberToRemove;
  
      const currentMember = await db.models.Member.findOne({
        where: { community, user: currentUserId },
        include: [
          {
            model: db.models.Role,
            as: 'Role',
            attributes: ['name'],
          },
        ],
      });
  
      if (!currentMember || !['Community Admin', 'Community Moderator'].includes(currentMember.Role.name)) {
        return next(createError(403, 'NOT_ALLOWED_ACCESS'));
      }
  
      await memberToRemove.destroy();
  
      res.status(200).json({
        status: true,
        message: 'Member removed successfully',
      });
    } catch (err) {
      console.error(err);
      next(createError(500, 'Failed to remove member'));
    }
  };