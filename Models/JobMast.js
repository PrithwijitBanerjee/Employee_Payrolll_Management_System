const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Employee = require('./employee');
const ProjHelp = require('./projhelp')

const JobMast = sequelize.define('JobMast', {
  JobNo: {
    type: DataTypes.STRING(15),
    primaryKey: true,
    allowNull: false,
  },
  JobDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  JobFrom: {
    type: DataTypes.STRING(5),
    allowNull: false,
    references: {
      model: Employee,
      key: 'EmplCode'
    }
  },
  JobTo: {
    type: DataTypes.STRING(5),
    allowNull: false,
    references: {
      model: Employee,
      key: 'EmplCode'
    }
  },
  BasicAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  DiscAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  GrossAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  TaxAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  NetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  JobStatus: {
    type: DataTypes.STRING(3),
    allowNull: false,
    references: {
      model: ProjHelp,
      key: 'code'
    }
  }
}, {
  tableName: 'jobmast',
  timestamps: true
});

JobMast.belongsTo(Employee, {
  foreignKey: 'JobFrom',
  targetKey: 'EmplCode',
  as: 'fromUser'
});

JobMast.belongsTo(Employee, {
  foreignKey: 'JobTo',
  targetKey: 'EmplCode',
  as: 'toUser'
});

JobMast.belongsTo(ProjHelp, {
  foreignKey: 'JobStatus',
  targetKey: 'code',
  as: 'status'
});

module.exports = JobMast;