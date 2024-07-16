import { DataTypes, Model } from 'sequelize';
import { Snowflake } from '@theinternetfolks/snowflake';

export default (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Community, { as: 'ownedCommunities', foreignKey: 'owner' });
      User.hasMany(models.Member, { foreignKey: 'user' });
    }
  }

  User.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: () => Snowflake.generate().toString(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  }, {
    modelName: 'User',
    sequelize,
    timestamps: false,
  });

  return User;
};
