const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const role = sequelize.define(
  "Role",
  {
    code: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "role",
    timestamps: true,
  }
);

module.exports = role;
