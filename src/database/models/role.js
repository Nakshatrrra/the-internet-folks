import { DataTypes, Model } from 'sequelize';
import { Snowflake } from '@theinternetfolks/snowflake';

export default (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.Member, { foreignKey: 'role' });
    }
  }

  Role.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: () => Snowflake.generate().toString(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    modelName: 'Role',
    sequelize,
    timestamps: false,
  });

  return Role;
};
