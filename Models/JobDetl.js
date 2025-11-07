const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const ProjHelp = require("./projhelp");
const JobMast = require("./JobMast");
const Project = require("./Project")

const JobDetl = sequelize.define(
  "JobDetl",
  {
    JobNo: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      allowNull: false,
    },
    JobMasterNo: {
      type: DataTypes.STRING(15),
      allowNull: false,
      references: {
        model: JobMast,
        key: "JobNo",
      },
    },
    ClientCode: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
    },
    ProjectCode: {
      type: DataTypes.STRING(6),
      primaryKey: true,
      allowNull: false,
      references: {
        model: Project,
        key: "ProjectCode",
      },
    },
    Particulars: {
      type: DataTypes.STRING(5000),
      allowNull: true,
    },
    ExpDelvDate: {
      type: DataTypes.DATEONLY,
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
    BasicAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    DiscRate: {
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
    SGSTRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    CGSTRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    IGSTRate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    SGSTAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    CGSTAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    IGSTAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    NetAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
  },
  {
    tableName: "jobdetl",
    timestamps: true,
  }
);

JobDetl.belongsTo(JobMast, {
  foreignKey: "JobMasterNo",
  targetKey: "JobNo",
  as: "job",
});

JobDetl.belongsTo(ProjHelp, {
  foreignKey: "JobStatus",
  targetKey: "code",
  as: "status",
});

JobDetl.belongsTo(Project, {
  foreignKey: "ProjectCode",
  targetKey: "ProjectCode",
  as: "project",
});

module.exports = JobDetl;
