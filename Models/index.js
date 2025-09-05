const sequelize = require('../config/db');
const User = require('./user');
const Role = require('./role');

// Setup associations
Role.hasMany(User, { foreignKey: 'role' });
User.belongsTo(Role, { foreignKey: 'role' });

module.exports = {
  sequelize,
  User,
  Role
};