const JobDetl = require("../Models/JobDetl");
const JobMastService = require("./jobmast.service");
const Project = require("../Models/Project");
const JobMast = require("../Models/JobMast");
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
  let { BasicAmount = 0, DiscRate = 0, DiscAmount = 0, ProjectCode } = data;

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
  const TaxAmount = SGSTAmount + CGSTAmount + IGSTAmount;
  const NetAmount = GrossAmount + TaxAmount;

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
    TaxAmount,
    NetAmount,
  };
};

const updateJobMasterTotals = async (JobMasterNo) => {
  const details = await JobDetl.findAll({ where: { JobMasterNo } });
  if (!details.length) return;

  const totals = details.reduce(
    (acc, item) => {
      acc.BasicAmount += parseFloat(item.BasicAmount || 0);
      acc.DiscAmount += parseFloat(item.DiscAmount || 0);
      acc.GrossAmount += parseFloat(item.GrossAmount || 0);
      acc.TaxAmount +=
        parseFloat(item.SGSTAmount || 0) +
        parseFloat(item.CGSTAmount || 0) +
        parseFloat(item.IGSTAmount || 0);
      acc.NetAmount += parseFloat(item.NetAmount || 0);
      return acc;
    },
    {
      BasicAmount: 0,
      DiscAmount: 0,
      GrossAmount: 0,
      TaxAmount: 0,
      NetAmount: 0,
    }
  );

  await JobMast.update(totals, { where: { JobNo: JobMasterNo } });
};

const JobDetlService = {
  async createJob(data, logData) {
    const JobNo = await generateJobNo();
    const calcData = await calculateAmounts(data);

    let { JobMasterNo } = data;

    // 🔹 If no JobMasterNo → create new JobMast using your JobMast service
    if (!JobMasterNo) {
      const newJobMast = await JobMastService.createJob(
        {
          JobDate: new Date(),
          JobTo: null,
          JobStatus: data.JobStatus,
          BasicAmount: 0,
          DiscAmount: 0,
          GrossAmount: 0,
          TaxAmount: 0,
          NetAmount: 0,
        },
        logData
      );

      JobMasterNo = newJobMast.JobNo;
    }

    // 🔹 Create JobDetl
    const jobDetl = await JobDetl.create({ ...calcData, JobNo, JobMasterNo });

    // 🔹 Update JobMast totals
    await updateJobMasterTotals(JobMasterNo);

    return jobDetl;
  },

  async createJobs(dataArray, logData) {
    if (!Array.isArray(dataArray) || dataArray.length === 0) {
      throw new Error("Data must be a non-empty array");
    }

    let { JobMasterNo } = dataArray[0];

    // 🔹 If no JobMasterNo → create a new JobMast record
    if (!JobMasterNo) {
      const newJobMast = await JobMastService.createJob(
        {
          JobDate: new Date(),
          JobTo: null,
          JobStatus: dataArray[0].JobStatus,
          BasicAmount: 0,
          DiscAmount: 0,
          GrossAmount: 0,
          TaxAmount: 0,
          NetAmount: 0,
        },
        logData
      );

      JobMasterNo = newJobMast.JobNo;
    }

    const jobDetlRecords = [];

    // 🔹 Loop through each detail entry
    for (const data of dataArray) {
      const JobNo = await generateJobNo();
      const calcData = await calculateAmounts(data);

      const jobDetl = await JobDetl.create({
        ...calcData,
        JobNo,
        JobMasterNo,
      });

      jobDetlRecords.push(jobDetl);
    }

    // 🔹 Update totals after all JobDetl are added
    await updateJobMasterTotals(JobMasterNo);

    return {
      JobMasterNo,
      JobDetails: jobDetlRecords,
    };
  },

  async updateJob(JobNo, data) {
    const calcData = await calculateAmounts(data);
    await JobDetl.update(calcData, { where: { JobNo } });

    const job = await JobDetl.findOne({ where: { JobNo } });
    if (job?.JobMasterNo) {
      await updateJobMasterTotals(job.JobMasterNo);
    }

    return await this.getJobById(JobNo);
  },

  async getAllJobs() {
    return await JobDetl.findAll({
      include: [
        { association: "project" },
        { association: "status" },
        { association: "job" },
        { association: "client" },
        { association: "project" },
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

  async deleteJob(JobNo) {
    const job = await JobDetl.findOne({ where: { JobNo } });
    if (!job) throw new Error("Job not found");

    const { JobMasterNo } = job;

    const result = await JobDetl.destroy({ where: { JobNo } });

    if (JobMasterNo) {
      await updateJobMasterTotals(JobMasterNo);
    }

    return {
      message: "Job detail deleted successfully",
      affectedRows: result,
      JobMasterNo,
    };
  },
};

module.exports = JobDetlService;
