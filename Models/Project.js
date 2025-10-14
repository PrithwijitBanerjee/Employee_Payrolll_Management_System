const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProjHelp = require('./projhelp');

const Project = sequelize.define('Project', {
  ProjectCode: {
    type: DataTypes.STRING(6),
    primaryKey: true,
    allowNull: false
  },
  ProjectName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  SGSTRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  CGSTRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  IGSTRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  ProjectStatus: {
    type: DataTypes.STRING(3),
    allowNull: true,
    references: {
      model: ProjHelp,
      key: 'code'
    }
  }
}, {
  tableName: 'project',
  timestamps: true
});

Project.belongsTo(ProjHelp, {
  foreignKey: 'ProjectStatus',
  targetKey: 'code',
  as: 'status'
});

module.exports = Project;