const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Employee = require("./employee");
const ProjHelp = require("./projhelp");
const Client = require("./client");

const JobMast = sequelize.define(
  "JobMast",
  {
    JobNo: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    JobDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    ClientCode: {
      type: DataTypes.STRING(6),
      allowNull: true,
      references: {
        model: Client,
        key: "ClientCode",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    BasicAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    DiscAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    GrossAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    TaxAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    NetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    JobStatus: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: ProjHelp,
        key: "code",
      },
    },
  },
  {
    tableName: "jobmast",
    timestamps: true,
  }
);

JobMast.belongsTo(Employee, {
  foreignKey: "JobFrom",
  targetKey: "EmplCode",
  as: "fromUser",
});

JobMast.belongsTo(Employee, {
  foreignKey: "JobTo",
  targetKey: "EmplCode",
  as: "toUser",
});

JobMast.belongsTo(ProjHelp, {
  foreignKey: "JobStatus",
  targetKey: "code",
  as: "status",
});

JobMast.belongsTo(Client, {
  foreignKey: "ClientCode",
  targetKey: "ClientCode",
  as: "client",
});

module.exports = JobMast;
