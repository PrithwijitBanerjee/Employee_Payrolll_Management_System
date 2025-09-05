const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('employeeManagement', 'postgres', 'root', {
  host: 'localhost',
  dialect: 'postgres',
});

module.exports = sequelize;