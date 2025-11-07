const JobDetl = require("../Models/JobDetl");
const Project = require("../Models/Project");
const { Op } = require("sequelize");

const generateJobNo = async () => {
  const lastJob = await JobDetl.findOne({
    order: [["createdAt", "DESC"]],
  });

  if (!lastJob) return "JD00001";

  const lastNumber = parseInt(lastJob.JobNo.replace(/\D/g, ""), 10);
  const newNumber = lastNumber + 1;
  return `JD${newNumber.toString().padStart(5, "0")}`;
};

const calculateAmounts = async (data) => {
  let {
    BasicAmount = 0,
    DiscRate = 0,
    DiscAmount = 0,
    ProjectCode,
  } = data;

  const project = await Project.findByPk(ProjectCode);
  if (!project) throw new Error("Invalid Project Code");

  const SGSTRate = project.SGSTRate || 0;
  const CGSTRate = project.CGSTRate || 0;
  const IGSTRate = project.IGSTRate || 0;

  if (DiscAmount > 0) DiscRate = 0;
  else DiscAmount = (BasicAmount * DiscRate) / 100;

  const GrossAmount = BasicAmount - DiscAmount;

  const SGSTAmount = (GrossAmount * SGSTRate) / 100;
  const CGSTAmount = (GrossAmount * CGSTRate) / 100;
  const IGSTAmount = (GrossAmount * IGSTRate) / 100;

  const NetAmount =
    GrossAmount + SGSTAmount + CGSTAmount + IGSTAmount;

  return {
    ...data,
    SGSTRate,
    CGSTRate,
    IGSTRate,
    DiscAmount,
    GrossAmount,
    SGSTAmount,
    CGSTAmount,
    IGSTAmount,
    NetAmount,
  };
};

// Service Methods
const JobDetlService = {
  async createJob(data) {
    const JobNo = await generateJobNo();
    const calcData = await calculateAmounts(data);
    return await JobDetl.create({ ...calcData, JobNo });
  },

  async getAllJobs() {
    return await JobDetl.findAll({
      include: [
        { association: "project" },
        { association: "status" },
        { association: "job" },
      ],
    });
  },

  async getJobById(JobNo) {
    return await JobDetl.findOne({
      where: { JobNo },
      include: [
        { association: "project" },
        { association: "status" },
        { association: "job" },
      ],
    });
  },

  async updateJob(JobNo, data) {
    const calcData = await calculateAmounts(data);
    await JobDetl.update(calcData, {
      where: { JobNo },
    });
    return await this.getJobById(JobNo);
  },

  async deleteJob(JobNo) {
    return await JobDetl.destroy({
      where: { JobNo },
    });
  },
};

module.exports = JobDetlService;