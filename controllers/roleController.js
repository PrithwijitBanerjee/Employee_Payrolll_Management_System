const RoleService = require("../service/role.service");
const { successResponse, errorResponse } = require("../utils/response");

exports.create = async (req, res) => {
    try {
        const { role } = req.body;
        const data = await RoleService.createRole(role);
        successResponse(res, "Add successful", data);
    } catch (err) {
        errorResponse(res, err.status || 500, err.message || "Server error", err.error);
    }
};

exports.getAll = async (req, res) => {
    try {
        const data = await RoleService.getAllRoles();
        successResponse(res, "Data retrieved successfully", data);
    } catch (err) {
        errorResponse(res, err.status || 500, err.message || "Server error", err.error);
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await RoleService.getRoleById(id);
        successResponse(res, "Data retrieved successfully", data);
    } catch (err) {
        errorResponse(res, err.status || 500, err.message || "Server error", err.error);
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const data = await RoleService.updateRole(id, role);
        successResponse(res, "Update successful", data);
    } catch (err) {
        errorResponse(res, err.status || 500, err.message || "Server error", err.error);
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await RoleService.deleteRole(id);
        successResponse(res, "Delete successful", data);
    } catch (err) {
        errorResponse(res, err.status || 500, err.message || "Server error", err.error);
    }
};