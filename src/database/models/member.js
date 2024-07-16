import { DataTypes, Model } from 'sequelize';
import { Snowflake } from '@theinternetfolks/snowflake';

export default (sequelize) => {
  class Member extends Model {
    static associate(models) {
      Member.belongsTo(models.Community, { foreignKey: 'community', as: 'Community' });
      Member.belongsTo(models.User, { foreignKey: 'user', as: 'User' });
      Member.belongsTo(models.Role, { foreignKey: 'role', as: 'Role' });
    }
  }

  Member.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: () => Snowflake.generate().toString(),
      primaryKey: true,
    },
    community: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'communities',
        key: 'id',
      },
    },
    user: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'roles',
        key: 'id',
      },
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    modelName: 'Member',
    sequelize,
    timestamps: false,
  });

  return Member;
};
