const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'employeeManagement',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'root', // Now it will use 'admin' from .env
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: console.log,
    port: process.env.DB_PORT || 5432,
  }
);

module.exports = sequelize;