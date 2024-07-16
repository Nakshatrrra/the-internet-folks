import { Snowflake } from '@theinternetfolks/snowflake';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('members', {
      id: {
        type: Sequelize.STRING,
        defaultValue: () => Snowflake.generate().toString(),
        primaryKey: true,
      },
      community: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'communities',
          key: 'id',
        },
      },
      user: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      role: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'roles',
          key: 'id',
        },
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('members');
  },
};
