const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProjHelp = require('./projhelp');

const Department = sequelize.define('Department', {
  DeptCode: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    primaryKey: true
  },
  DeptName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  DeptStatus: {
    type: DataTypes.CHAR(3),
    allowNull: false,
    references: {
      model: ProjHelp,
      key: 'code'
    }
  }
}, {
  tableName: 'department',
  timestamps: true
});

Department.belongsTo(ProjHelp, {
  foreignKey: 'DeptStatus',
  targetKey: 'code',
  as: 'status'
});

module.exports = Department;