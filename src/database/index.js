import { Sequelize } from 'sequelize';

import * as config from '@/config/sequelize';

// import models
import userModel from './models/user';
import communityModel from './models/community';
import roleModel from './models/role';
import memberModel from './models/member';

// Configuration
const env = process.env.NODE_ENV;
const sequelizeConfig = config[env];

// Create sequelize instance
const sequelize = new Sequelize(sequelizeConfig);

// Import all model files
const modelDefiners = [
  userModel,
  communityModel,
  roleModel,
  memberModel
];

const models = {
  User: userModel(sequelize),
  Community: communityModel(sequelize),
  Role: roleModel(sequelize),
  Member: memberModel(sequelize),
};

// eslint-disable-next-line no-restricted-syntax
for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

// Associations
Object.keys(sequelize.models)
  .forEach((modelName) => {
    if (sequelize.models[modelName].associate) {
      sequelize.models[modelName].associate(sequelize.models);
    }
  });

export default sequelize;
export { models };