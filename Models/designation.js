const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProjHelp = require("./projhelp");

const Designation = sequelize.define(
  "Designation",
  {
    DesgCode: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    DesgName: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DesgStatus: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: ProjHelp,
        key: "code",
      },
    },
  },
  {
    tableName: "designation",
    timestamps: false,
  }
);

Designation.belongsTo(ProjHelp, {
  foreignKey: "DesgStatus",
  targetKey: "code",
  as: "status",
});

module.exports = Designation;
