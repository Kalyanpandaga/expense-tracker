const { Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const models = {};
models.UserProfile = require('./userProfile')(sequelize, Sequelize.DataTypes);
models.Transaction = require('./transaction')(sequelize, Sequelize.DataTypes);
models.Category = require('./category')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;