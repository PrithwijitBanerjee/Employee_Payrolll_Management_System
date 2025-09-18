const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ProjHelp = sequelize.define('ProjHelp', {
  code: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    primaryKey: true,
    unique : true
  },
  data: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  tag: {
    type: DataTypes.CHAR(2),
    allowNull: false
  }
}, {
  tableName: 'projhelp',
  timestamps: false
});

module.exports = ProjHelp;