const JobMast = require("../Models/JobMast");
const Employee = require("../Models/employee");
const ProjHelp = require("../Models/projhelp");
const { Op } = require("sequelize");

const generateJobNo = async () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = String(now.getFullYear());

  const prefix = `J/${month}${year}/`;

  const latestJob = await JobMast.findOne({
    where: {
      JobNo: {
        [Op.like]: `${prefix}%`,
      },
    },
    order: [["JobNo", "DESC"]],
  });

  let nextNumber = "000001";
  if (latestJob) {
    const lastNumberPart = latestJob.JobNo.split("/")[2];
    const next = parseInt(lastNumberPart) + 1;
    nextNumber = String(next).padStart(6, "0");
  }

  return `${prefix}${nextNumber}`;
};

exports.createJob = async (data, logData) => {
  const jobNo = await generateJobNo();

  // const toEmp = await Employee.findByPk(data.JobTo);
  // if (!toEmp) throw new Error(`JobTo employee '${data.JobTo}' not found.`);

  const status = await ProjHelp.findByPk(data.JobStatus);
  if (!status) throw new Error(`JobStatus '${data.JobStatus}' is invalid.`);

  const fromData = await Employee.findOne({where : {Email : logData.email}});

  const basic = parseFloat(data.BasicAmount || 0);
  const discount = parseFloat(data.DiscAmount || 0);
  const gross = basic - discount;
  const tax = gross * 0.18;
  const net = gross + tax;

  const job = await JobMast.create({
    JobNo: jobNo,
    JobDate: data.JobDate || new Date(),
    JobFrom: fromData.EmplCode || "",
    JobTo: data.JobTo || "",
    BasicAmount: basic,
    DiscAmount: discount,
    GrossAmount: gross,
    TaxAmount: tax,
    NetAmount: net,
    JobStatus: data.JobStatus,
  });

  return job;
};

exports.getAllJobs = async () => {
  return JobMast.findAll({
    include: [
      { model: Employee, as: "fromUser", attributes: ["EmplCode", "EmplName"] },
      { model: Employee, as: "toUser", attributes: ["EmplCode", "EmplName"] },
      { model: ProjHelp, as: "status", attributes: ["code", "data"] },
    ],
    order: [["JobDate", "DESC"]],
  });
};

exports.getJobById = async (jobNo) => {
  return JobMast.findOne({
    where: { JobNo: jobNo },
    include: [
      { model: Employee, as: "fromUser", attributes: ["EmplCode", "EmplName"] },
      { model: Employee, as: "toUser", attributes: ["EmplCode", "EmplName"] },
      { model: ProjHelp, as: "status", attributes: ["code", "data"] },
    ],
  });
};

exports.updateJob = async (jobNo, data) => {
  const job = await JobMast.findByPk(jobNo);
  if (!job) throw new Error('Job not found');

  if (data.JobTo) {
    const toEmp = await Employee.findByPk(data.JobTo);
    if (!toEmp) throw new Error(`JobTo employee '${data.JobTo}' not found.`);
  }

  if (data.JobStatus) {
    const status = await ProjHelp.findByPk(data.JobStatus);
    if (!status) throw new Error(`JobStatus '${data.JobStatus}' is invalid.`);
  }

  const basic = parseFloat(data.BasicAmount || job.BasicAmount || 0);
  const discount = parseFloat(data.DiscAmount || job.DiscAmount || 0);
  const gross = basic - discount;
  const tax = gross * 0.18;
  const net = gross + tax;

  await job.update({
    ...data,
    GrossAmount: gross,
    TaxAmount: tax,
    NetAmount: net
  });

  return job;
};

exports.deleteJob = async (jobNo) => {
  const job = await JobMast.findByPk(jobNo);
  if (!job) throw new Error("Job not found");
  await job.destroy();
};
