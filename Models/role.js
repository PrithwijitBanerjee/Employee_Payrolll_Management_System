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

const initRoles = async () => {
  const defaultRoles = [
    { code: "001", roleName: "Admin" },
    { code: "002", roleName: "Employee" }
  ];

  for (const role of defaultRoles) {
    const [record, created] = await Role.findOrCreate({
      where: { code: role.code },
      defaults: { roleName: role.roleName }
    });

    if (created) {
      console.log(`✅ Role '${role.roleName}' added.`);
    }
  }
};

module.exports = role;
