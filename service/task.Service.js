const { Op } = require("sequelize");
const TaskMast = require("../models/taskMast");
const JobDetl = require("../models/JobDetl");
const Client = require("../models/client");
const Project = require("../models/Project");
const Employee = require("../models/Employee");
const ProjHelp = require("../models/projhelp");
const sequelize = require("../config/db");

const generateTaskId = async () => {
  const lastTask = await TaskMast.findOne({
    order: [["TaskId", "DESC"]],
  });

  let nextNumber = 1;
  if (lastTask && lastTask.TaskId) {
    const lastNum = parseInt(lastTask.TaskId.split("/")[1]);
    if (!isNaN(lastNum)) nextNumber = lastNum + 1;
  }

  return `T/${nextNumber.toString().padStart(6, "0")}`;
};

const calculateDuration = (startTime, endTime) => {
  const start = new Date(`1970-01-01T${startTime}Z`);
  const end = new Date(`1970-01-01T${endTime}Z`);
  const diffMs = end - start;
  if (diffMs < 0) throw new Error("End time must be after start time");
  return Math.round(diffMs / (1000 * 60));
};

const createTask = async (data, loggedUser) => {
  const {
    JobNo,
    StartTime,
    EndTime,
    Particulars,
    TaskStatus = "003",
    JobTo,
  } = data;

  if (!JobNo) throw new Error("JobNo is required");
  // if (!StartTime) throw new Error("StartTime is required");
  // if (!EndTime) throw new Error("EndTime is required");
  // if (!TaskStatus) throw new Error("TaskStatus is required");

  const job = await JobDetl.findByPk(JobNo, {
    include: ["job", "project"],
  });

  if (!job) throw new Error("Invalid JobNo");

  const employee = await Employee.findByPk(loggedUser.code);
  if (!employee) throw new Error("Invalid employee user");

  const status = await ProjHelp.findOne({
    where: { code: TaskStatus },
  });
  if (!status) throw new Error("Invalid TaskStatus (not under tag '02')");

  // const DurationMin = calculateDuration(StartTime, EndTime);
  const TaskId = await generateTaskId();

  const newTask = await TaskMast.create({
    TaskId,
    TaskDate: new Date(),
    JobFrom: loggedUser.code,
    JobTo,
    JobNo,
    ClientCode: job.job.ClientCode,
    ProjectCode: job.ProjectCode,
    Particulars,
    // StartTime,
    // EndTime,
    // DurationMin,
    TaskStatus,
    Remarks: "",
  });

  return newTask;
};

const getAllTasks = async () => {
  return TaskMast.findAll({
    include: [
      { model: JobDetl, as: "job" },
      { model: Client, as: "client" },
      { model: Project, as: "project" },
      { model: Employee, as: "employee" },
      { model: ProjHelp, as: "status" },
    ],
    order: [["TaskDate", "DESC"]],
  });
};

const getTaskById = async (TaskId) => {
  const task = await TaskMast.findByPk(TaskId, {
    include: ["job", "client", "project", "employee", "status"],
  });
  if (!task) throw new Error("Task not found");
  return task;
};

const updateTask = async (TaskId, data) => {
  const task = await TaskMast.findByPk(TaskId);
  if (!task) throw new Error("Task not found");

  const protectedFields = [
    "TaskDate",
    "JobFrom",
    "JobTo",
    "JobNo",
    "ClientCode",
    "ProjectCode",
    "Particulars",
  ];

  protectedFields.forEach((field) => delete data[field]);

  if (data.StartTime && data.EndTime)
    data.DurationMin = calculateDuration(data.StartTime, data.EndTime);

  await task.update(data);
  return task;
};

const updateOwnTask = async (TaskId, data) => {
  const task = await TaskMast.findByPk(TaskId);
  if (!task) throw new Error("Task not found");

  const protectedFields = ["DurationMin", "StartTime", "EndTime"];

  protectedFields.forEach((field) => delete data[field]);

  if (data.JobTo) {
    data.DurationMin = null,
    data.StartTime = null,
    data.EndTime = null,
    data.Remarks = "",
    data.TaskStatus = "003"
  }

  await task.update(data);
  return task;
};

const deleteTask = async (TaskId) => {
  const task = await TaskMast.findByPk(TaskId);
  if (!task) throw new Error("Task not found");
  await task.destroy();
  return { message: "Task deleted successfully" };
};

const getTasksByJobFrom = async (userId) => {
  return TaskMast.findAll({
    where: { JobFrom: userId, TaskStatus : "005" },
    include: [
      { model: Employee, as: "fromUser", attributes: ["EmplCode", "EmplName"] },
      { model: Employee, as: "toUser", attributes: ["EmplCode", "EmplName"] },
    ],
    order: [["TaskDate", "DESC"]],
  });
};

const getTasksByJobTo = async (userId) => {
  return TaskMast.findAll({
    where: { JobTo: userId, TaskStatus: { [Op.ne]: "005" } },
    include: [
      { model: Employee, as: "fromUser", attributes: ["EmplCode", "EmplName"] },
      { model: Employee, as: "toUser", attributes: ["EmplCode", "EmplName"] },
    ],
    order: [["TaskDate", "DESC"]],
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTasksByJobFrom,
  getTasksByJobTo,
  updateOwnTask,
};
