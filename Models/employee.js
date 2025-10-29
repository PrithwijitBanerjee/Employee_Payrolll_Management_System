const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcrypt");
const ProjHelp = require("./projhelp");
const Department = require("./department");
const Designation = require("./Designation");

const Employee = sequelize.define(
  "Employee",
  {
    EmplCode: {
      type: DataTypes.CHAR(5),
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    Email : {
      type : DataTypes.STRING(100),
      allowNull : false,
      unique : true,
    },
    EmplName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    EmplTag: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    EmplType: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: ProjHelp,
        key: "code",
      },
    },
    DeptCode: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: Department,
        key: "DeptCode",
      },
    },
    DesgCode: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: Designation,
        key: "DesgCode",
      },
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DOJ: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    UserID: {
      type: DataTypes.STRING(15),
      allowNull: false,
      unique: true,
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    EmplStatus: {
      type: DataTypes.CHAR(3),
      allowNull: false,
      references: {
        model: ProjHelp,
        key: "code",
      },
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

Employee.beforeCreate(async (employee, options) => {
  if (employee.Password) {
    const salt = await bcrypt.genSalt(10);
    employee.Password = await bcrypt.hash(employee.Password, salt);
  }
});

module.exports = Employee;