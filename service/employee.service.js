const bcrypt = require("bcrypt");
const ProjHelp = require("../Models/projhelp");
const Department = require("../Models/department.model");
const Designation = require("../Models/Designation");
const { getNextCode } = require("../utils/codeGenerator");
const Employee = require("../Models/employee")

async function createEmployee(data) {
  const requiredFields = [
    "EmplName",
    "EmplTag",
    "EmplType",
    "DeptCode",
    "DesgCode",
    "UserID",
    "Password",
    "EmplStatus",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      throw new Error(`${field} is required`);
    }
  }

  data.EmplCode = await getNextCode(Employee, "EmplCode", 5);

  const existingTag = await Employee.findOne({ where: { EmplTag: data.EmplTag } });
  if (existingTag) throw new Error("EmplTag must be unique");

  const existingUser = await Employee.findOne({ where: { UserID: data.UserID } });
  if (existingUser) throw new Error("UserID must be unique");

  const employee = await Employee.create(data);
  return employee;
}

async function getAllEmployees() {
  return await Employee.findAll({
    include: [
      { model: ProjHelp, as: "type" },
      { model: ProjHelp, as: "status" },
      { model: Department, as: "department" },
      { model: Designation, as: "designation" },
    ],
  });
}

async function getEmployeeById(emplCode) {
  const employee = await Employee.findByPk(emplCode, {
    include: [
      { model: ProjHelp, as: "type" },
      { model: ProjHelp, as: "status" },
      { model: Department, as: "department" },
      { model: Designation, as: "designation" },
    ],
  });
  if (!employee) throw new Error("Employee not found");
  return employee;
}

async function updateEmployee(emplCode, data) {
  const employee = await Employee.findByPk(emplCode);
  if (!employee) throw new Error("Employee not found");

  if (data.EmplTag && data.EmplTag !== employee.EmplTag) {
    const existingTag = await Employee.findOne({ where: { EmplTag: data.EmplTag } });
    if (existingTag) throw new Error("EmplTag must be unique");
  }

  if (data.UserID && data.UserID !== employee.UserID) {
    const existingUser = await Employee.findOne({ where: { UserID: data.UserID } });
    if (existingUser) throw new Error("UserID must be unique");
  }

  if (data.Password) {
    const salt = await bcrypt.genSalt(10);
    data.Password = await bcrypt.hash(data.Password, salt);
  }

  await employee.update(data);
  return employee;
}

async function deleteEmployee(emplCode) {
  const employee = await Employee.findByPk(emplCode);
  if (!employee) throw new Error("Employee not found");

  await employee.destroy();
  return true;
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};