const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const ProjHelp = require("./projhelp");
const Department = require("./department");
const Designation = require("./Designation");
const role = require("./role");

const Employee = sequelize.define(
  "Employee",
  {
    EmplCode: {
      type: DataTypes.CHAR(5),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    EmplName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    EmplTag: {
      type: DataTypes.STRING(10),
      allowNull: true,
      unique: true,
    },
    EmplType: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      references: {
        model: ProjHelp,
        key: "code",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    DeptCode: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      references: {
        model: Department,
        key: "DeptCode",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    DesgCode: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      references: {
        model: Designation,
        key: "DesgCode",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DOJ: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: role,
        key: "code",
      },
    },
    EmplStatus: {
      type: DataTypes.CHAR(3),
      allowNull: true,
      references: {
        model: ProjHelp,
        key: "code",
      },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "employee",
    timestamps: true,
  }
);

Employee.belongsTo(ProjHelp, {
  foreignKey: "EmplType",
  targetKey: "code",
  as: "type",
});

Employee.belongsTo(ProjHelp, {
  foreignKey: "EmplStatus",
  targetKey: "code",
  as: "status",
});

Employee.belongsTo(Department, {
  foreignKey: "DeptCode",
  targetKey: "DeptCode",
  as: "department",
});

Employee.belongsTo(Designation, {
  foreignKey: "DesgCode",
  targetKey: "DesgCode",
  as: "designation",
});

Employee.belongsTo(role, {
  foreignKey: "role",
  targetKey: "code",
  as: "roleName",
});

Employee.beforeCreate(async (employee, options) => {
  if (employee.Password) {
    const salt = await bcrypt.genSalt(10);
    employee.Password = await bcrypt.hash(employee.Password, salt);
  }
});

module.exports = Employee;
