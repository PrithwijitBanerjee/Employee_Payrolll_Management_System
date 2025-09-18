const Joi = require("joi");
const {
  successResponse,
  errorResponse,
} = require("../utils/response");
const projHelpService = require("../service/projHelpService");
const { Sequelize } = require('sequelize');

// Validation schema
const projHelpSchema = Joi.object({
  code: Joi.string().length(3).required(),
  data: Joi.string().max(50).required(),
  tag: Joi.string().length(2).required(),
});

// Create
exports.createProjHelp = async (req, res) => {
  const { error, value } = projHelpSchema.validate(req.body);
  if (error) {
    return errorResponse(res, 400, "Validation Error", error.details);
  }

  try {
    const existing = await projHelpService.findByCode(value.code);
    if (existing) {
      return errorResponse(res, 409, "Code already exists");
    }

    const result = await projHelpService.create(value);
    return successResponse(res, "ProjHelp entry created successfully", result);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      return errorResponse(res, 409, "Code already exists");
    }
    return errorResponse(res, 500, "Internal Server Error", err.message);
  }
};

// Get All
exports.getAllProjHelp = async (req, res) => {
  try {
    const data = await projHelpService.findAll();
    return successResponse(res, "ProjHelp entries fetched successfully", data);
  } catch (err) {
    return errorResponse(res, 500, "Internal Server Error", err.message);
  }
};

// Get by Code
exports.getProjHelpByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const entry = await projHelpService.findByCode(code);
    if (!entry) {
      return errorResponse(res, 404, "ProjHelp entry not found");
    }

    return successResponse(res, "ProjHelp entry fetched successfully", entry);
  } catch (err) {
    return errorResponse(res, 500, "Internal Server Error", err.message);
  }
};

// Update
exports.updateProjHelp = async (req, res) => {
  const { code } = req.params;
  const { error, value } = projHelpSchema.validate(req.body);
  const {data, tag} = value;
  if (error) {
    return errorResponse(res, 400, "Validation Error", error.details);
  }
  
  try {
    const updated = await projHelpService.update(code, {code, data, tag});
    if (!updated) {
      return errorResponse(res, 404, "ProjHelp entry not found");
    }

    return successResponse(res, "ProjHelp entry updated successfully", updated);
  } catch (err) {
    if (err instanceof Sequelize.UniqueConstraintError) {
      return errorResponse(res, 409, "Code already exists");
    }
    return errorResponse(res, 500, "Internal Server Error", err.message);
  }
};

// Delete
exports.deleteProjHelp = async (req, res) => {
  const { code } = req.params;

  try {
    const deleted = await projHelpService.delete(code);
    if (!deleted) {
      return errorResponse(res, 404, "ProjHelp entry not found");
    }

    return successResponse(res, "ProjHelp entry deleted successfully");
  } catch (err) {
    return errorResponse(res, 500, "Internal Server Error", err.message);
  }
};
