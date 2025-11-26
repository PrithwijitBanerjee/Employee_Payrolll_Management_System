const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const JobDetl = require("./JobDetl");
const Client = require("./client");
const Project = require("./Project");
const ProjHelp = require("./projhelp");
const Employee = require("./employee");

const TaskMast = sequelize.define(
  "TaskMast",
  {
    TaskId: {
      type: DataTypes.STRING(10),
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    TaskDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true,
      },
    },
    JobFrom: {
      type: DataTypes.STRING(5),
      allowNull: true,
      references: {
        model: Employee,
        key: "EmplCode",
      },
    },
    JobTo: {
      type: DataTypes.STRING(5),
      allowNull: true,
      references: {
        model: Employee,
        key: "EmplCode",
      },
    },
    JobNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    ClientCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    ProjectCode: {
      type: DataTypes.STRING(6),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    Particulars: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      validate: {
        len: [0, 5000],
      },
    },
    Remarks: {
      type: DataTypes.STRING(5000),
      allowNull: true,
      validate: {
        len: [0, 5000],
      },
    },
    StartTime: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    EndTime: {
      type: DataTypes.TIME,
      allowNull: true,
      validate: {
        notEmpty: true,
      },
    },
    DurationMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    TaskStatus: {
      type: DataTypes.STRING(3),
      allowNull: false,
      references: {
        model: ProjHelp,
        key: "code",
      },
      validate: {
        notEmpty: true,
      },
    },
  },
  {
    tableName: "taskmast",
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ["JobNo", "ClientCode", "ProjectCode"],
      },
    ],
  }
);

// Associations

TaskMast.belongsTo(Employee, {
  foreignKey: "EmplCode",
  targetKey: "EmplCode",
  as: "employee",
});

TaskMast.belongsTo(ProjHelp, {
  foreignKey: "TaskStatus",
  targetKey: "code",
  as: "status",
});

TaskMast.belongsTo(JobDetl, {
  foreignKey: "JobNo",
  targetKey: "JobNo",
  as: "job",
  constraints: false,
});

TaskMast.belongsTo(Client, {
  foreignKey: "ClientCode",
  targetKey: "ClientCode",
  as: "client",
  constraints: false,
});

TaskMast.belongsTo(Project, {
  foreignKey: "ProjectCode",
  targetKey: "ProjectCode",
  as: "project",
  constraints: false,
});

TaskMast.belongsTo(Employee, {
  foreignKey: "JobFrom",
  targetKey: "EmplCode",
  as: "fromUser",
});

TaskMast.belongsTo(Employee, {
  foreignKey: "JobTo",
  targetKey: "EmplCode",
  as: "toUser",
});

module.exports = TaskMast;
