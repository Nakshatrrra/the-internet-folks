import { DataTypes, Model } from 'sequelize';
import { Snowflake } from '@theinternetfolks/snowflake';

export default (sequelize) => {
  class Community extends Model {
    static associate(models) {
      Community.belongsTo(models.User, { as: 'ownerDetails', foreignKey: 'owner' });
      Community.belongsToMany(models.User, { through: models.Member, foreignKey: 'community' });
    }
  }

  Community.init({
    id: {
      type: DataTypes.STRING,
      defaultValue: () => Snowflake.generate().toString(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    owner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: true,
    },
  }, {
    modelName: 'Community',
    sequelize,
    timestamps: false,
  });

  return Community;
};
