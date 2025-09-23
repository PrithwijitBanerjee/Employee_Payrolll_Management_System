const EmployeeService = require("../service/employee.service");
const { successResponse, errorResponse } = require("../utils/response");

async function create(req, res) {
  try {
    const employee = await EmployeeService.createEmployee(req.body);
    return successResponse(res, "Employee created successfully", employee);
  } catch (error) {
    console.log(error)
    return errorResponse(res, 400, error.message);
  }
}

async function getAll(req, res) {
  try {
    const employees = await EmployeeService.getAllEmployees();
    return successResponse(res, "Employees retrieved successfully", employees);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
}

async function getById(req, res) {
  try {
    const { emplCode } = req.params;
    const employee = await EmployeeService.getEmployeeById(emplCode);
    return successResponse(res, "Employee retrieved successfully", employee);
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
}

async function update(req, res) {
  try {
    const { emplCode } = req.params;
    const updatedEmployee = await EmployeeService.updateEmployee(emplCode, req.body);
    return successResponse(res, "Employee updated successfully", updatedEmployee);
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
}

async function remove(req, res) {
  try {
    const { emplCode } = req.params;
    await EmployeeService.deleteEmployee(emplCode);
    return successResponse(res, "Employee deleted successfully");
  } catch (error) {
    return errorResponse(res, 404, error.message);
  }
}

module.exports = {
  create,
  getAll,
  getById,
  update,
  remove,
};