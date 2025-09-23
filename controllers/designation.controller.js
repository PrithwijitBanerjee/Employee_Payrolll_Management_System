const DesignationService = require("../service/designation.service");
const { successResponse, errorResponse } = require("../utils/response");

exports.createDesignation = async (req, res) => {
  try {
    const { DesgName, DesgStatus } = req.body;

    if (!DesgName || DesgName.length > 50) {
      return errorResponse(res, 400, "DesgName is required and must be at most 50 characters.");
    }
    if (!DesgStatus || DesgStatus.length !== 3) {
      return errorResponse(res, 400, "DesgStatus is required and must be 3 characters.");
    }

    const designation = await DesignationService.createDesignation({ DesgName, DesgStatus });
    return successResponse(res, "Designation created successfully", designation);
  } catch (error) {
    return errorResponse(res, 500, "Failed to create designation", error.message);
  }
};

exports.getAllDesignations = async (req, res) => {
  try {
    const designations = await DesignationService.getAllDesignations();
    return successResponse(res, "Designations fetched successfully", designations);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch designations", error.message);
  }
};

exports.getDesignationByCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || code.length !== 3) {
      return errorResponse(res, 400, "Invalid designation code");
    }

    const designation = await DesignationService.getDesignationByCode(code);

    if (!designation) {
      return errorResponse(res, 404, "Designation not found");
    }

    return successResponse(res, "Designation fetched successfully", designation);
  } catch (error) {
    return errorResponse(res, 500, "Failed to fetch designation", error.message);
  }
};

exports.updateDesignation = async (req, res) => {
  try {
    const { code } = req.params;
    const { DesgName, DesgStatus } = req.body;

    if (!code || code.length !== 3) {
      return errorResponse(res, 400, "Invalid designation code");
    }

    if (DesgName && DesgName.length > 50) {
      return errorResponse(res, 400, "DesgName must be at most 50 characters.");
    }

    if (DesgStatus && DesgStatus.length !== 3) {
      return errorResponse(res, 400, "DesgStatus must be 3 characters.");
    }

    const updated = await DesignationService.updateDesignation(code, { DesgName, DesgStatus });

    if (!updated) {
      return errorResponse(res, 404, "Designation not found or not updated");
    }

    return successResponse(res, "Designation updated successfully", updated);
  } catch (error) {
    return errorResponse(res, 500, "Failed to update designation", error.message);
  }
};

exports.deleteDesignation = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || code.length !== 3) {
      return errorResponse(res, 400, "Invalid designation code");
    }

    const deleted = await DesignationService.deleteDesignation(code);

    if (!deleted) {
      return errorResponse(res, 404, "Designation not found or already deleted");
    }

    return successResponse(res, "Designation deleted successfully");
  } catch (error) {
    return errorResponse(res, 500, "Failed to delete designation", error.message);
  }
};