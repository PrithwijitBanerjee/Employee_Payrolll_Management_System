const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ProjHelp = require("./projhelp");

const Client = sequelize.define('Client', {
  ClientCode: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  ClientName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  ClientStatus: {
    type: DataTypes.STRING(10),
    allowNull: true,
    references: {
      model: ProjHelp,
      key: 'code'
    }
  }
}, {
  tableName: 'client',
  timestamps: true
});

Client.belongsTo(ProjHelp, {
    foreignKey : "ClientStatus",
    targetKey : "code",
    as : "status"
});

module.exports = Client;