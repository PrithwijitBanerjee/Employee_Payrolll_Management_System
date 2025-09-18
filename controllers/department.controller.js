const departmentService = require('../service/department.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.createDepartment = async (req, res) => {
    try {
        const data = req.body;
        const department = await departmentService.createDepartment(data);
        return successResponse(res, 'Department created successfully', department);
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
};

exports.getAllDepartments = async (req, res) => {
    try {
        const departments = await departmentService.getAllDepartments();
        return successResponse(res, 'Departments fetched successfully', departments);
    } catch (err) {
        return errorResponse(res, 500, err.message);
    }
};

exports.getDepartmentByCode = async (req, res) => {
    try {
        const { DeptCode } = req.params;
        const department = await departmentService.getDepartmentByCode(DeptCode);
        return successResponse(res, 'Department fetched successfully', department);
    } catch (err) {
        return errorResponse(res, 404, err.message);
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const { DeptCode } = req.params;
        const updateData = req.body;
        const department = await departmentService.updateDepartment(DeptCode, updateData);
        return successResponse(res, 'Department updated successfully', department);
    } catch (err) {
        return errorResponse(res, 400, err.message);
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const { DeptCode } = req.params;
        const result = await departmentService.deleteDepartment(DeptCode);
        return successResponse(res, result.message);
    } catch (err) {
        return errorResponse(res, 404, err.message);
    }
};